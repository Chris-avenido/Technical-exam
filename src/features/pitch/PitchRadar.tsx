import React from 'react';
import { Crosshair } from 'lucide-react';
import { MatchEvent } from '../../types';

interface PitchRadarProps {
  events: MatchEvent[];
  selectedEvent: MatchEvent | null;
  onSelectEvent: (event: MatchEvent) => void;
}

export const PitchRadar: React.FC<PitchRadarProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
}) => {
  return (
    <div className="pitch-card">
      <div className="pitch-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Crosshair size={16} color="var(--accent-turf)" />
          <span className="pitch-title">Tactical Pitch Coordinate Map</span>
        </div>
        <span className="pitch-hint">
          Click any blip to jump video to frame
        </span>
      </div>

      <div className="rugby-pitch-wrapper">
        <div className="rugby-pitch">
          {/* Pitch Field Markings */}
          <div className="pitch-try-left" title="In-Goal Left" />
          <div className="pitch-22m-left" title="22 Metre Line Left" />
          <div className="pitch-halfway" title="Halfway Line" />
          <div className="pitch-22m-right" title="22 Metre Line Right" />
          <div className="pitch-try-right" title="In-Goal Right" />

          {/* Attack Directions */}
          <div className="pitch-dir-left">
            All Blacks Attack ➔
          </div>
          <div className="pitch-dir-right">
            ⬅ Springboks Attack
          </div>

          {/* Dynamic Event Blips */}
          {events.map((evt) => {
            const isSelected = selectedEvent?.id === evt.id;
            let bgColor = '#00e599';
            if (evt.eventType === 'tackle') bgColor = '#ffb800';
            if (evt.eventType === 'turnover') bgColor = '#00d2ff';
            if (evt.eventType === 'breakdown' || evt.eventType === 'penalty_goal') bgColor = '#ff4757';
            if (evt.eventType === 'scrum' || evt.eventType === 'lineout') bgColor = '#a855f7';

            return (
              <div
                key={evt.id}
                className={`pitch-point ${isSelected ? 'active' : ''}`}
                style={{
                  left: `${evt.pitchX}%`,
                  top: `${evt.pitchY}%`,
                  backgroundColor: bgColor,
                  boxShadow: isSelected ? `0 0 12px ${bgColor}` : 'none'
                }}
                onClick={() => onSelectEvent(evt)}
                title={`${evt.gameTimeFormatted} | ${evt.eventType.toUpperCase()} - ${evt.playerName || evt.description}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
