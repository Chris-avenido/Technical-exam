import React, { useState } from 'react';
import { X, FileDown, Copy, CheckCircle, FileText } from 'lucide-react';
import { Match, MatchEvent, CoachingNote, MatchStats } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: Match;
  events: MatchEvent[];
  notes: CoachingNote[];
  stats: MatchStats;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  match,
  events,
  notes,
  stats
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState<boolean>(false);

  const reportData = {
    match: {
      title: match.title,
      competition: match.competition,
      score: `${match.homeTeam.shortName} ${match.homeScore} - ${match.awayScore} ${match.awayTeam.shortName}`,
      venue: match.venue,
      date: match.matchDate
    },
    analytics: stats,
    totalEventsLogged: events.length,
    events: events.map(e => ({
      time: e.gameTimeFormatted,
      period: e.period,
      type: e.eventType,
      team: e.teamId,
      player: e.playerName,
      description: e.description
    })),
    coachingFeedback: notes.map(n => ({
      author: n.authorName,
      time: n.gameTimeFormatted,
      category: n.category,
      content: n.content
    }))
  };

  const jsonString = JSON.stringify(reportData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `framesports-match-report-${match.matchDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={18} color="var(--accent-turf)" />
            <h3 className="modal-title">Export Tactical Match Package</h3>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            This package contains all time-synchronized event telemetry, player involvements, set-piece stats, and coaching notes formatted for Opta and StatsPerform rugby feeds.
          </p>

          <div className="code-preview-box">
            <pre className="code-preview-text">
              {jsonString}
            </pre>
          </div>

          <div className="modal-actions-row">
            <button className="btn-ctrl" onClick={handleCopy}>
              {copied ? <CheckCircle size={14} color="var(--accent-turf)" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button className="btn-primary" onClick={handleDownload}>
              <FileDown size={14} />
              <span>Download (.json)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
