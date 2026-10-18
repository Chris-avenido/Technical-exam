import React from 'react';
import { ShieldCheck, Zap } from 'lucide-react';
import { MatchStats, Player } from '../../types';

interface AnalyticsDashboardProps {
  stats: MatchStats;
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  stats,
  players,
  onSelectPlayer
}) => {
  const homeTackleRate = Math.round(
    (stats.tackles.homeMade / (stats.tackles.homeMade + stats.tackles.homeMissed)) * 100
  );
  const awayTackleRate = Math.round(
    (stats.tackles.awayMade / (stats.tackles.awayMade + stats.tackles.awayMissed)) * 100
  );

  return (
    <div className="analytics-dashboard-container">
      <div>
        <h3 className="panel-title">Match Analytics & KPIs</h3>
        <p className="panel-subtitle">
          Real-time match data telemetry & tactical split
        </p>
      </div>

      {/* Possession & Territory Bars */}
      <div className="form-card">
        <div className="stat-row">
          <div className="stat-labels">
            <span style={{ color: '#3b82f6' }}>NZL {stats.possession.home}%</span>
            <span style={{ color: 'var(--text-muted)' }}>Possession</span>
            <span style={{ color: 'var(--accent-gold)' }}>{stats.possession.away}% RSA</span>
          </div>
          <div className="stat-bar-container">
            <div className="stat-bar-home" style={{ width: `${stats.possession.home}%` }} />
            <div className="stat-bar-away" style={{ width: `${stats.possession.away}%` }} />
          </div>
        </div>

        <div className="stat-row" style={{ marginBottom: 0 }}>
          <div className="stat-labels">
            <span style={{ color: '#3b82f6' }}>NZL {stats.territory.home}%</span>
            <span style={{ color: 'var(--text-muted)' }}>Territory</span>
            <span style={{ color: 'var(--accent-gold)' }}>{stats.territory.away}% RSA</span>
          </div>
          <div className="stat-bar-container">
            <div className="stat-bar-home" style={{ width: `${stats.territory.home}%` }} />
            <div className="stat-bar-away" style={{ width: `${stats.territory.away}%` }} />
          </div>
        </div>
      </div>

      {/* Key Metric Gauges */}
      <div className="kpi-grid">
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-turf)' }}>
            <ShieldCheck size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>TACKLE SUCCESS</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{homeTackleRate}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>NZL ({stats.tackles.homeMade}/{stats.tackles.homeMade + stats.tackles.homeMissed})</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{awayTackleRate}%</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>RSA ({stats.tackles.awayMade}/{stats.tackles.awayMade + stats.tackles.awayMissed})</div>
            </div>
          </div>
        </div>

        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-cyan)' }}>
            <Zap size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>TURNOVERS WON</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{stats.turnovers.homeWon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>NZL Breakdown</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-gold)' }}>{stats.turnovers.awayWon}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>RSA Breakdown</div>
            </div>
          </div>
        </div>
      </div>

      {/* Set Piece Dominance */}
      <div className="form-card">
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          SET PIECE METRICS
        </div>
        <div className="set-piece-row">
          <span style={{ color: 'var(--text-muted)' }}>Scrums Won (Own Feed)</span>
          <span>NZL {stats.scrums.homeWon}/{stats.scrums.homeWon + stats.scrums.homeLost} · RSA {stats.scrums.awayWon}/{stats.scrums.awayWon + stats.scrums.awayLost}</span>
        </div>
        <div className="set-piece-row">
          <span style={{ color: 'var(--text-muted)' }}>Lineouts Won (Own Throw)</span>
          <span>NZL {stats.lineouts.homeWon}/{stats.lineouts.homeWon + stats.lineouts.homeLost} · RSA {stats.lineouts.awayWon}/{stats.lineouts.awayWon + stats.lineouts.awayLost}</span>
        </div>
        <div className="set-piece-row" style={{ borderBottom: 'none' }}>
          <span style={{ color: 'var(--text-muted)' }}>Penalties Conceded</span>
          <span style={{ color: 'var(--accent-danger)' }}>NZL {stats.penalties.homeConceded} · RSA {stats.penalties.awayConceded}</span>
        </div>
      </div>

      {/* Top Impact Players */}
      <div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
          TOP PLAYER IMPACT RATINGS
        </div>
        <div className="player-impact-list">
          {players.slice(0, 4).map(p => (
            <div
              key={p.id}
              onClick={() => onSelectPlayer(p)}
              className="player-impact-card"
            >
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
                  #{p.number} {p.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {p.position} · {p.teamId === 'team-nz' ? 'NZL' : 'RSA'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.75rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--accent-turf)', fontWeight: 700 }}>{p.tacklesCount}</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Tackles</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{p.metresCarried}m</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Carries</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>{p.turnoversWon}</span>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Turnovers</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
