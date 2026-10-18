import React, { useState } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { EventType, MatchEvent, Player } from '../../types';

interface QuickTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTimeSec: number;
  players: Player[];
  onSaveEvent: (eventData: Partial<MatchEvent>) => void;
}

export const QuickTagModal: React.FC<QuickTagModalProps> = ({
  isOpen,
  onClose,
  currentTimeSec,
  players,
  onSaveEvent
}) => {
  if (!isOpen) return null;

  const [eventType, setEventType] = useState<EventType>('tackle');
  const [teamId, setTeamId] = useState<string>('team-nz');
  const [playerId, setPlayerId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [pitchX, setPitchX] = useState<number>(50);
  const [pitchY, setPitchY] = useState<number>(50);

  const mins = Math.floor(currentTimeSec / 60);
  const secs = Math.floor(currentTimeSec % 60);
  const timeFormatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPlayer = players.find(p => p.id === playerId);

    onSaveEvent({
      timestampMs: Math.round(currentTimeSec * 1000),
      gameTimeFormatted: timeFormatted,
      period: currentTimeSec > 90 ? '2H' : '1H',
      eventType,
      teamId,
      playerId: selPlayer?.id,
      playerName: selPlayer?.name || 'Unassigned',
      playerNumber: selPlayer?.number,
      outcome: 'successful',
      pitchX,
      pitchY,
      description: description || `Tagged ${eventType} at ${timeFormatted}`,
      tags: ['Live Coach Tag', eventType.toUpperCase()]
    });

    onClose();
  };

  const filteredPlayers = players.filter(p => p.teamId === teamId);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Tag size={18} color="var(--accent-turf)" />
            <h3 className="modal-title">Tag Event @ {timeFormatted}</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-grid-2">
            <div>
              <label className="form-label">Event Type</label>
              <select
                className="form-select"
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
              >
                <option value="try">Try</option>
                <option value="tackle">Tackle</option>
                <option value="turnover">Turnover</option>
                <option value="scrum">Scrum</option>
                <option value="lineout">Lineout</option>
                <option value="breakdown">Breakdown</option>
                <option value="penalty_goal">Penalty</option>
              </select>
            </div>

            <div>
              <label className="form-label">Team</label>
              <select
                className="form-select"
                value={teamId}
                onChange={(e) => {
                  setTeamId(e.target.value);
                  setPlayerId('');
                }}
              >
                <option value="team-nz">🇳🇿 All Blacks</option>
                <option value="team-sa">🇿🇦 Springboks</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Involved Player</label>
            <select
              className="form-select"
              value={playerId}
              onChange={(e) => setPlayerId(e.target.value)}
            >
              <option value="">-- Unassigned Player --</option>
              {filteredPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  #{p.number} {p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Tactical Note / Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Counter-ruck pressure forced spilled ball at 2nd receiver"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="form-label">Pitch Location (X: {pitchX}%, Y: {pitchY}%)</label>
            <div className="form-grid-2">
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Lengthwise (0-100%):</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pitchX}
                  onChange={(e) => setPitchX(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-turf)' }}
                />
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Widthwise (0-100%):</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={pitchY}
                  onChange={(e) => setPitchY(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent-turf)' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-ctrl" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Plus size={14} />
              <span>Save Event & Marker</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
