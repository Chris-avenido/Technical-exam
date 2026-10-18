import React from 'react';
import { Plus } from 'lucide-react';
import { MatchEvent, EventType } from '../../types';

interface EventCardProps {
  event: MatchEvent;
  isSelected: boolean;
  onSelect: (event: MatchEvent) => void;
  onAddToReel: (event: MatchEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected,
  onSelect,
  onAddToReel
}) => {
  const getBadgeClass = (type: EventType) => {
    switch (type) {
      case 'try': return 'badge-try';
      case 'tackle': return 'badge-tackle';
      case 'turnover': return 'badge-turnover';
      case 'penalty_goal':
      case 'breakdown': return 'badge-penalty';
      case 'scrum':
      case 'lineout': return 'badge-scrum';
      default: return 'badge-try';
    }
  };

  return (
    <div
      className={`event-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(event)}
    >
      <div className="event-top">
        <span className={`event-badge ${getBadgeClass(event.eventType)}`}>
          {event.eventType.replace('_', ' ')}
        </span>
        <span className="event-time">{event.gameTimeFormatted} ({event.period})</span>
      </div>

      {event.playerName && (
        <div className="event-player">
          #{event.playerNumber} {event.playerName}
        </div>
      )}

      <div className="event-desc">{event.description}</div>

      <div className="event-actions">
        <div className="event-tags">
          {event.tags.slice(0, 2).map((tg, i) => (
            <span key={i} className="event-tag-pill">
              {tg}
            </span>
          ))}
        </div>

        <button
          className="btn-reel-add"
          onClick={(e) => {
            e.stopPropagation();
            onAddToReel(event);
          }}
          title="Add to Highlight Reel"
        >
          <Plus size={12} />
          <span>Reel</span>
        </button>
      </div>
    </div>
  );
};
