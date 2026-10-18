import React from 'react';
import { Calendar, MapPin, Trophy } from 'lucide-react';
import { Match } from '../../types';

interface MatchHeaderProps {
  match: Match;
}

export const MatchHeader: React.FC<MatchHeaderProps> = ({ match }) => {
  return (
    <section className="match-hero">
      <div className="match-info">
        <h1>{match.title}</h1>
        <div className="match-subtext">
          <span className="subtext-item">
            <Trophy size={14} color="var(--accent-gold)" />
            {match.competition} · {match.round}
          </span>
          <span className="subtext-item">
            <MapPin size={14} />
            {match.venue}
          </span>
          <span className="subtext-item">
            <Calendar size={14} />
            {match.matchDate}
          </span>
        </div>
      </div>

      <div className="match-scoreboard">
        <div className="team-box home-team">
          <span className="team-flag">{match.homeTeam.flagEmoji}</span>
          <span className="team-name">{match.homeTeam.name}</span>
          <span className="team-short-name">{match.homeTeam.shortName}</span>
        </div>

        <div className="score-display">
          <span>{match.homeScore}</span>
          <span className="score-divider">:</span>
          <span>{match.awayScore}</span>
        </div>

        <div className="team-box away-team">
          <span className="team-name">{match.awayTeam.name}</span>
          <span className="team-short-name">{match.awayTeam.shortName}</span>
          <span className="team-flag">{match.awayTeam.flagEmoji}</span>
        </div>
      </div>
    </section>
  );
};
