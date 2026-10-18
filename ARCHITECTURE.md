# Framesports Engineering Architecture & Technical Blueprint

Prepared for: **Ori (CTO) & Framesports Founding Team**  
Domain: **Rugby Match Video Analysis, Tactical Feedback & Highlight Reel Workflows**

---

## 1. Problem Statement & User Journey

Professional rugby coaches and performance analysts review dozens of matches per season. A typical workflow involves:
1. Reviewing 80+ minutes of match footage to identify crucial turning points (turnovers at the ruck, missed tackles, lineout execution, strike-move tries).
2. Attaching granular feedback to individual players or positional units (e.g. tight-five scrummaging, back-three backfield defense).
3. Compiling 60-90 second highlight packages for squad presentation meetings or social media.

**The Architectural Challenge**:
Video platforms often suffer from loose synchronization, sluggish seeking, cumbersome UI friction, and unoptimized video transcoding. Our architecture addresses these friction points through millisecond-level precision, spatial coordinate tagging, and asynchronous video clipping pipelines.

---

## 2. System Architecture Overview

```
                      +---------------------------------------+
                      |       React 18 + TypeScript UI        |
                      |  (Scrubber, Pitch Radar, Telestration)|
                      +-------------------+-------------------+
                                          |
                                          | REST API / WebSockets
                                          v
                      +---------------------------------------+
                      |       Ruby on Rails Backend (API)     |
                      |   Controllers, Services, Serializers  |
                      +---------+-------------------+---------+
                                |                   |
                 PostgreSQL (PostGIS)         Sidekiq Background Jobs
                 (Events, Notes, Stats)       (Video Slicing & FFmpeg)
                                |                   |
                                v                   v
                         Amazon RDS / S3    AWS MediaConvert / CDN
```

---

## 3. Ruby on Rails & PostgreSQL Database Schema

### 3.1 ActiveRecord Models

```ruby
# app/models/match.rb
class Match < ApplicationRecord
  belongs_to :home_team, class_name: 'Team'
  belongs_to :away_team, class_name: 'Team'
  has_many :match_events, -> { order(:timestamp_ms) }, dependent: :destroy
  has_many :coaching_notes, dependent: :destroy
  has_many :highlight_reels, dependent: :destroy

  validates :title, :match_date, :video_url, presence: true
end

# app/models/match_event.rb
class MatchEvent < ApplicationRecord
  belongs_to :match
  belongs_to :team
  belongs_to :player, optional: true
  has_many :coaching_notes, dependent: :nullify

  enum event_type: {
    try: 0,
    conversion: 1,
    penalty_goal: 2,
    tackle: 3,
    turnover: 4,
    scrum: 5,
    lineout: 6,
    breakdown: 7,
    card_yellow: 8,
    card_red: 9
  }

  validates :timestamp_ms, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :period, inclusion: { in: %w[1H 2H ET] }

  # Scopes for rapid multi-facet search
  scope :by_period, ->(period) { where(period: period) if period.present? && period != 'all' }
  scope :by_team, ->(team_id) { where(team_id: team_id) if team_id.present? && team_id != 'all' }
  scope :search_text, ->(query) {
    where("description ILIKE :q OR tags @> ARRAY[:q]", q: "%#{query}%") if query.present?
  }
end

# app/models/coaching_note.rb
class CoachingNote < ApplicationRecord
  belongs_to :match
  has_and_belongs_to_many :players

  enum category: {
    tactical: 0,
    technique: 1,
    positioning: 2,
    commendation: 3,
    discipline: 4
  }

  validates :content, :author_name, presence: true
end
```

### 3.2 PostgreSQL Migrations & Indexing Strategy

```ruby
class CreateMatchEvents < ActiveRecord::Migration[7.1]
  def change
    enable_extension 'postgis' unless extension_enabled?('postgis')

    create_table :match_events, id: :uuid do |t|
      t.references :match, null: false, foreign_key: true, type: :uuid
      t.references :team, null: false, foreign_key: true, type: :uuid
      t.references :player, foreign_key: true, type: :uuid
      t.integer :timestamp_ms, null: false
      t.string :game_time_formatted, null: false
      t.string :period, limit: 4, null: false
      t.integer :event_type, null: false, default: 0
      t.string :outcome, default: 'successful'
      t.decimal :pitch_x, precision: 5, scale: 2 # 0.00 to 100.00%
      t.decimal :pitch_y, precision: 5, scale: 2 # 0.00 to 100.00%
      t.text :description, null: false
      t.decimal :clip_start_sec, precision: 6, scale: 2
      t.decimal :clip_end_sec, precision: 6, scale: 2
      t.text :tags, array: true, default: []

      t.timestamps
    end

    # High-Performance Indexes:
    # 1. Composite B-Tree for timeline queries (filtering events for a match in chronological order)
    add_index :match_events, [:match_id, :timestamp_ms]

    # 2. GIN Index on tags array for instant multi-tag filtering
    add_index :match_events, :tags, using: 'gin'

    # 3. Filtering by event type and team
    add_index :match_events, [:match_id, :event_type]
    add_index :match_events, [:match_id, :team_id]
  end
end
```

---

## 4. Video Engine & Highlight Reel Slicing Pipeline

### 4.1 Frame-Accurate Video Slicing via Sidekiq & FFmpeg
When coaches assemble a highlight reel in the React UI, client-side requests trigger an asynchronous background worker:

```ruby
# app/jobs/compile_highlight_reel_job.rb
class CompileHighlightReelJob < ApplicationJob
  queue_as :video_processing

  def perform(highlight_reel_id)
    reel = HighlightReel.find(highlight_reel_id)
    clips = reel.clips.order(:position)

    # 1. Download source footage segment from S3
    working_dir = Dir.mktmpdir("reel-#{reel.id}")

    clip_paths = clips.map.with_index do |clip, idx|
      out_path = File.join(working_dir, "clip_#{idx}.mp4")
      # Lossless keyframe extraction
      system(
        "ffmpeg", "-ss", clip.start_time_sec.to_s,
        "-to", clip.end_time_sec.to_s,
        "-i", reel.match.video_url,
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-c:a", "aac", out_path
      )
      out_path
    end

    # 2. Concatenate clips into final highlight package
    concat_list = File.join(working_dir, "clips.txt")
    File.open(concat_list, "w") do |f|
      clip_paths.each { |p| f.puts("file '#{p}'") }
    end

    final_output = File.join(working_dir, "final_reel.mp4")
    system("ffmpeg", "-f", "concat", "-safe", "0", "-i", concat_list, "-c", "copy", final_output)

    # 3. Upload to AWS S3 & Broadcast to Coach via ActionCable
    s3_url = S3Uploader.upload(final_output, key: "reels/#{reel.id}.mp4")
    reel.update!(export_url: s3_url, status: :completed)

    ActionCable.server.broadcast("match_#{reel.match_id}", {
      type: 'HIGHLIGHT_REEL_READY',
      reel_id: reel.id,
      download_url: s3_url
    })
  ensure
    FileUtils.remove_entry(working_dir) if working_dir
  end
end
```

---

## 5. Frontend Architecture & Performance Optimizations

1. **State Isolation**: Video scrubbing and canvas telestration maintain sub-16ms render loops without triggering full-tree React re-renders.
2. **Normalized Coordinates**: Pitch and telestration annotations use percentage coordinates (`0.00%` - `100.00%`), ensuring vector accuracy whether viewed on a 13" laptop, 32" tactical screen, or an iPad on the training pitch.
3. **Resilient API Architecture**: The client includes automated fallback support, ensuring analysts can review offline local recordings during pitch-side sessions where connectivity is unreliable.

---

## 6. Testing & Quality Assurance Plan

- **Backend (RSpec & RuboCop)**:
  - Model specs verifying validations and timestamp constraints.
  - Request specs testing event filters across 2,000+ match events in <50ms.
  - Job specs ensuring Sidekiq idempotency.
- **Frontend (Vitest & React Testing Library)**:
  - Timeline seeking logic and timecode formatting.
  - Telestration canvas clear and serialization.
- **End-to-End (Playwright)**:
  - Full coach flow: scrubbing video -> tagging breakdown turnover -> attaching coach feedback -> compiling highlight reel -> downloading report.
