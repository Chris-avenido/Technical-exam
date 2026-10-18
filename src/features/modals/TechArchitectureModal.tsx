import React, { useState } from 'react';
import { X, Server, Database, CheckSquare, Layers, Cpu } from 'lucide-react';

interface TechArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'rails' | 'video' | 'testing'>('overview');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content modal-architecture" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Server size={20} color="var(--accent-turf)" />
            <div>
              <h3 className="modal-title">Engineering Architecture & Decisions</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                System Design Brief for CTO Ori & Framesports Engineering Team
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="tab-nav" style={{ marginBottom: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Layers size={14} />
            <span>Architecture & State</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rails' ? 'active' : ''}`}
            onClick={() => setActiveTab('rails')}
          >
            <Database size={14} />
            <span>Rails & Postgres Schema</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Cpu size={14} />
            <span>Video & FFmpeg Pipeline</span>
          </button>
          <button 
            className={`tab-btn ${activeTab === 'testing' ? 'active' : ''}`}
            onClick={() => setActiveTab('testing')}
          >
            <CheckSquare size={14} />
            <span>Testing & Reliability</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="modal-scroll-body">
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-card">
                <h4 style={{ color: 'var(--accent-turf)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  1. Real-Time Video & Timeline Synchronization
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  Rugby analysis requires millisecond precision to judge breakdown decisions, forward passes, and grounding on the tryline. Instead of high-frequency polling, our React frontend coordinates state via a single source of truth:
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: '#fff' }}>
                  <li><strong>Native HTML5 Media API:</strong> Driven by `timeupdate` and fine-grain `requestAnimationFrame` hooks during scrubbing.</li>
                  <li><strong>Canvas Telestration Layer:</strong> Rendered directly on top of the paused frame with coordinate normalization (0 to 1 scale) to guarantee aspect-ratio invariance across tablets and desktop monitors.</li>
                  <li><strong>Sub-second Frame Stepping:</strong> Discrete ±0.1s steps enable coaches to catch the exact microsecond of ball release or ruck entry.</li>
                </ul>
              </div>

              <div className="form-card">
                <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  2. Fast Video Workflow & Coach Ergonomics
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  A coach's time is extremely constrained. The UI eliminates repetitive friction with:
                </p>
                <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: '#fff' }}>
                  <li><strong>Timeline Heat Markers:</strong> Color-coded visual flags on the seekbar so coaches can visually scrub straight to tries (green), jackals (cyan), or scrum penalties (purple).</li>
                  <li><strong>Auto-Loop Clip Mode:</strong> When reviewing a 10s play, the player loops bounded between `clipStartSec` and `clipEndSec` until unpaused.</li>
                  <li><strong>1-Click Highlight Compilation:</strong> Adding clips into the queue instantly computes duration and builds sequential playback orders.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'rails' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-card">
                <h4 style={{ color: 'var(--accent-turf)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Ruby on Rails Backend Structure & Models
                </h4>
                <pre className="code-preview-text" style={{ background: 'rgba(0,0,0,0.5)', padding: '0.75rem' }}>
{`# app/models/match_event.rb
class MatchEvent < ApplicationRecord
  belongs_to :match
  belongs_to :team
  belongs_to :player, optional: true
  has_many :coaching_notes, dependent: :destroy

  enum event_type: {
    try: 0, conversion: 1, penalty_goal: 2, tackle: 3,
    turnover: 4, scrum: 5, lineout: 6, breakdown: 7, card_yellow: 8
  }

  validates :timestamp_ms, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :period, inclusion: { in: %w[1H 2H ET] }

  scope :for_period, ->(period) { where(period: period) if period.present? }
  scope :search_query, ->(q) {
    where("description ILIKE :q OR tags @> ARRAY[:q]", q: "%#{q}%")
  }
end`}
                </pre>
              </div>

              <div className="form-card">
                <h4 style={{ color: 'var(--accent-gold)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  PostgreSQL Schema & Indexing Strategy
                </h4>
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)' }}>
                  <li><strong style={{ color: '#fff' }}>B-Tree Index on (match_id, timestamp_ms):</strong> Delivers O(log N) fast seek scans when seeking video.</li>
                  <li><strong style={{ color: '#fff' }}>GIN Index on `tags text[]`:</strong> Instant multi-tag filtering (e.g. ['Dominant Tackle', 'Jackal']).</li>
                  <li><strong style={{ color: '#fff' }}>PostGIS / Coordinates (pitch_x, pitch_y):</strong> Coordinates stored as percentages or spatial geometry `POINT(x, y)` to calculate territory heatmap clusters.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-card">
                <h4 style={{ color: 'var(--accent-turf)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Video Processing & Highlight Reel Pipeline
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  How highlight reels and social media clips are generated reliably behind the scenes:
                </p>
                <ol style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', color: '#fff' }}>
                  <li><strong>Ingestion & HLS Transcoding:</strong> Raw match footage uploaded via presigned S3 URLs is split into multi-bitrate HLS streams (`.m3u8` with 2-second `.ts` segments) via AWS MediaConvert or background FFmpeg workers.</li>
                  <li><strong>Asynchronous Highlight Reel Slicing:</strong> When a coach clicks "Save Highlight Reel", a <code>CompileHighlightReelJob</code> (Sidekiq) is enqueued.</li>
                  <li><strong>Lossless Video Concat:</strong> FFmpeg extracts frame-accurate segments using:
                    <pre style={{
                      background: 'rgba(0,0,0,0.4)',
                      padding: '0.5rem',
                      marginTop: '0.3rem',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: 'var(--accent-cyan)'
                    }}>
ffmpeg -ss 00:00:20 -to 00:00:30 -i input.mp4 -c copy clip1.mp4
ffmpeg -f concat -safe 0 -i clips.txt -c copy highlight_package.mp4
                    </pre>
                  </li>
                  <li><strong>Notification:</strong> ActionCable / WebSocket notifies the coach's React client when the compiled video package is ready for download or social distribution.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'testing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-card">
                <h4 style={{ color: 'var(--accent-turf)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  Full User-Flow Testing & Reliability Strategy
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>
                  As emphasized in the job brief, developers must take full responsibility for testing complete user journeys:
                </p>
                <div className="form-grid-2" style={{ marginTop: '0.5rem' }}>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px' }}>
                    <strong style={{ color: '#fff' }}>Frontend (React + Vitest / Playwright):</strong>
                    <ul style={{ paddingLeft: '1rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                      <li>Scrubber seek accuracy and event marker synchronization.</li>
                      <li>Drawing canvas coordinate scaling across responsive viewports.</li>
                      <li>Filter state preservation during video playback.</li>
                    </ul>
                  </div>

                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px' }}>
                    <strong style={{ color: '#fff' }}>Backend (Rails RSpec + API Specs):</strong>
                    <ul style={{ paddingLeft: '1rem', marginTop: '0.3rem', color: 'var(--text-muted)' }}>
                      <li>Fast event filtering and pagination across 1,000+ match events.</li>
                      <li>Data validation for timestamp bounds and player references.</li>
                      <li>Idempotent highlight reel compilation jobs.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={onClose}>
            Back to Platform
          </button>
        </div>
      </div>
    </div>
  );
};
