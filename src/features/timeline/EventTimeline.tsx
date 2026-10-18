import React from 'react';
import { Search, Filter } from 'lucide-react';
import { MatchEvent } from '../../types';
import { EventCard } from './EventCard';

interface EventTimelineProps {
  events: MatchEvent[];
  selectedEvent: MatchEvent | null;
  onSelectEvent: (event: MatchEvent) => void;
  onAddToReel: (event: MatchEvent) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onAddToReel,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedTeam,
  setSelectedTeam,
  selectedPeriod,
  setSelectedPeriod
}) => {
  const eventTypes: { label: string; value: string }[] = [
    { label: 'All Events', value: 'all' },
    { label: 'Tries', value: 'try' },
    { label: 'Tackles', value: 'tackle' },
    { label: 'Turnovers', value: 'turnover' },
    { label: 'Scrums', value: 'scrum' },
    { label: 'Lineouts', value: 'lineout' },
    { label: 'Breakdowns', value: 'breakdown' },
    { label: 'Penalties', value: 'penalty_goal' },
  ];

  return (
    <div className="timeline-feature-container">
      {/* Search & Multi-facet Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search events, players (e.g. Savea, Kolbe), or tactics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Event Type Pills */}
        <div className="pill-row">
          {eventTypes.map((t) => (
            <button
              key={t.value}
              className={`pill ${selectedType === t.value ? 'active' : ''}`}
              onClick={() => setSelectedType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Period & Team Filter Pills */}
        <div className="filter-subrow">
          <div className="pill-row">
            {['all', 'team-nz', 'team-sa'].map((team) => (
              <button
                key={team}
                className={`pill ${selectedTeam === team ? 'active' : ''}`}
                onClick={() => setSelectedTeam(team)}
              >
                {team === 'all' ? 'Both Teams' : team === 'team-nz' ? '🇳🇿 NZL' : '🇿🇦 RSA'}
              </button>
            ))}
          </div>

          <div className="pill-row">
            {['all', '1H', '2H'].map((p) => (
              <button
                key={p}
                className={`pill ${selectedPeriod === p ? 'active' : ''}`}
                onClick={() => setSelectedPeriod(p)}
              >
                {p === 'all' ? 'Full Match' : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="events-stream">
        {events.length === 0 ? (
          <div className="empty-state">
            <Filter size={24} className="empty-state-icon" />
            <p>No match events match the active filters.</p>
          </div>
        ) : (
          events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              isSelected={selectedEvent?.id === evt.id}
              onSelect={onSelectEvent}
              onAddToReel={onAddToReel}
            />
          ))
        )}
      </div>
    </div>
  );
};
