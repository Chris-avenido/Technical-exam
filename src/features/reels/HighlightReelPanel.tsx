import React, { useState } from 'react';
import { Film, Play, Trash2, Download, CheckCircle } from 'lucide-react';
import { HighlightClipItem, HighlightReel } from '../../types';

interface HighlightReelPanelProps {
  reels: HighlightReel[];
  queuedClips: HighlightClipItem[];
  onRemoveClip: (id: string) => void;
  onPlayClip: (clip: HighlightClipItem) => void;
  onStartReelPlayback: () => void;
  onSaveNewReel: (title: string, description: string) => void;
}

export const HighlightReelPanel: React.FC<HighlightReelPanelProps> = ({
  reels,
  queuedClips,
  onRemoveClip,
  onPlayClip,
  onStartReelPlayback,
  onSaveNewReel,
}) => {
  const [reelTitle, setReelTitle] = useState<string>('Match Winning Moments & Turnovers');
  const [reelDescription, setReelDescription] = useState<string>('Tactical package for squad review');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const totalDuration = queuedClips.reduce(
    (acc, c) => acc + (c.endTimeSec - c.startTimeSec),
    0
  );

  const handleSave = () => {
    if (queuedClips.length === 0) return;
    onSaveNewReel(reelTitle, reelDescription);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="reels-panel-container">
      <div className="panel-header">
        <div>
          <h3 className="panel-title">Highlight Reel Builder</h3>
          <p className="panel-subtitle">
            Package key match moments for players & media
          </p>
        </div>

        {queuedClips.length > 0 && (
          <button 
            className="btn-primary" 
            onClick={onStartReelPlayback}
            style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
            title="Sequentially play all highlight clips"
          >
            <Play size={13} fill="#070a13" />
            <span>Play Reel ({Math.round(totalDuration)}s)</span>
          </button>
        )}
      </div>

      {/* Reel Setup Card */}
      <div className="form-card">
        <div>
          <label className="form-label">Package Title</label>
          <input
            type="text"
            className="form-input"
            value={reelTitle}
            onChange={(e) => setReelTitle(e.target.value)}
          />
        </div>

        <div className="reel-meta-row">
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {queuedClips.length} clips queued · Run Time: {Math.round(totalDuration)}s
          </span>

          <button
            className="btn-ctrl"
            onClick={handleSave}
            disabled={queuedClips.length === 0}
            style={{ fontSize: '0.75rem', borderColor: 'var(--accent-turf)', color: 'var(--accent-turf)' }}
          >
            {savedSuccess ? <CheckCircle size={13} /> : <Download size={13} />}
            <span>{savedSuccess ? 'Saved to Library' : 'Save Reel'}</span>
          </button>
        </div>
      </div>

      {/* Clip Queue List */}
      <div className="clips-stream">
        {queuedClips.length === 0 ? (
          <div className="empty-state">
            <Film size={24} className="empty-state-icon" />
            <p>No clips in the highlight reel yet.</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.3rem' }}>
              Click "+ Reel" on any match event card to add it to your reel.
            </p>
          </div>
        ) : (
          queuedClips.map((clip, index) => {
            const clipDur = Math.round(clip.endTimeSec - clip.startTimeSec);
            return (
              <div key={clip.id} className="reel-clip-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span className="clip-order-index">
                    #{index + 1}
                  </span>

                  <div>
                    <div className="clip-title">
                      {clip.title}
                    </div>
                    <div className="clip-subtitle">
                      {clip.description} · {clipDur}s cut
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    className="btn-ctrl"
                    style={{ padding: '0.3rem 0.5rem' }}
                    onClick={() => onPlayClip(clip)}
                    title="Preview single clip"
                  >
                    <Play size={12} />
                  </button>
                  <button
                    className="btn-ctrl"
                    style={{ padding: '0.3rem 0.5rem' }}
                    onClick={() => onRemoveClip(clip.id)}
                    title="Remove clip from reel"
                  >
                    <Trash2 size={12} />
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
