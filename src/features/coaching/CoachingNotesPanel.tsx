import React, { useState } from 'react';
import { MessageSquare, Plus, Trash2, UserCheck, Play } from 'lucide-react';
import { CoachingNote, CoachingCategory, Player } from '../../types';

interface CoachingNotesPanelProps {
  notes: CoachingNote[];
  players: Player[];
  currentVideoTimeSec: number;
  onAddNote: (note: Partial<CoachingNote>) => void;
  onDeleteNote: (id: string) => void;
  onSeekToNote: (timestampSec: number) => void;
}

export const CoachingNotesPanel: React.FC<CoachingNotesPanelProps> = ({
  notes,
  players,
  currentVideoTimeSec,
  onAddNote,
  onDeleteNote,
  onSeekToNote
}) => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>('Ori (Performance Lead)');
  const [category, setCategory] = useState<CoachingCategory>('tactical');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [content, setContent] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const mins = Math.floor(currentVideoTimeSec / 60);
    const secs = Math.floor(currentVideoTimeSec % 60);
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    onAddNote({
      authorName,
      authorRole: 'Technical Coaching Staff',
      category,
      taggedPlayerIds: selectedPlayerId ? [selectedPlayerId] : [],
      content,
      timestampMs: Math.round(currentVideoTimeSec * 1000),
      gameTimeFormatted: formatted
    });

    setContent('');
    setShowAddForm(false);
  };

  const getPlayerName = (id: string) => {
    const p = players.find(x => x.id === id);
    return p ? `#${p.number} ${p.name}` : id;
  };

  return (
    <div className="coaching-panel-container">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Coaching Feedback</h3>
          <p className="panel-subtitle">
            Video-synced tactical notes & player review
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
        >
          <Plus size={14} />
          <span>{showAddForm ? 'Cancel' : 'New Note'}</span>
        </button>
      </div>

      {/* Note Creator Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-grid-2">
            <div>
              <label className="form-label">Coach Name</label>
              <input
                type="text"
                className="form-input"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as CoachingCategory)}
              >
                <option value="tactical">Tactical</option>
                <option value="technique">Technique</option>
                <option value="positioning">Positioning</option>
                <option value="commendation">Commendation</option>
                <option value="discipline">Discipline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Target Player (Optional)</label>
            <select
              className="form-select"
              value={selectedPlayerId}
              onChange={(e) => setSelectedPlayerId(e.target.value)}
            >
              <option value="">-- General Team Note --</option>
              {players.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">
              Observation / Feedback (Frame: {Math.floor(currentVideoTimeSec)}s)
            </label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Body height into collision was exceptional. Replicate this footwork during Thursday prep session."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <button type="submit" className="btn-primary" style={{ fontSize: '0.75rem' }}>
              Save Coaching Note
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      <div className="notes-stream">
        {notes.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={24} className="empty-state-icon" />
            <p>No coaching notes created yet for this match.</p>
          </div>
        ) : (
          notes.map((note) => {
            const timeSec = note.timestampMs / 1000;
            return (
              <div key={note.id} className="coach-note-item">
                <div className="coach-note-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="coach-author">{note.authorName}</span>
                    <span className="coach-cat-tag">{note.category}</span>
                  </div>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="btn-icon-danger"
                    title="Delete Note"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="coach-text">{note.content}</div>

                <div className="coach-note-footer">
                  <div className="tagged-players">
                    {note.taggedPlayerIds.map(pid => (
                      <span key={pid} className="tagged-player-badge">
                        <UserCheck size={11} />
                        {getPlayerName(pid)}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn-ctrl"
                    style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                    onClick={() => onSeekToNote(timeSec)}
                    title="Jump to video frame"
                  >
                    <Play size={10} />
                    <span>{note.gameTimeFormatted}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
