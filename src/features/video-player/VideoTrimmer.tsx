import React, { useState } from 'react';
import { 
  Scissors, 
  Play, 
  Plus, 
  Download, 
  Check, 
  Clock, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface VideoTrimmerProps {
  currentTime: number;
  duration: number;
  inPoint: number;
  outPoint: number;
  setInPoint: (time: number) => void;
  setOutPoint: (time: number) => void;
  onPreviewCut: (inPt: number, outPt: number) => void;
  onSaveCutToReel: (title: string, inPt: number, outPt: number) => void;
  onDownloadCut: (inPt: number, outPt: number) => void;
  isCutting: boolean;
  cutProgress: number;
}

export const VideoTrimmer: React.FC<VideoTrimmerProps> = ({
  currentTime,
  duration,
  inPoint,
  outPoint,
  setInPoint,
  setOutPoint,
  onPreviewCut,
  onSaveCutToReel,
  onDownloadCut,
  isCutting,
  cutProgress
}) => {
  const [clipTitle, setClipTitle] = useState('Key Phase & Corner Finish');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const cutDuration = Math.max(0, outPoint - inPoint);

  const handleSetIn = () => {
    const newIn = Math.min(currentTime, outPoint - 0.5);
    setInPoint(Math.max(0, Number(newIn.toFixed(1))));
  };

  const handleSetOut = () => {
    const newOut = Math.max(currentTime, inPoint + 0.5);
    setOutPoint(Math.min(duration, Number(newOut.toFixed(1))));
  };

  const handleSaveToReel = () => {
    if (!clipTitle.trim()) return;
    onSaveCutToReel(clipTitle, inPoint, outPoint);
    setSavedSuccess(true);
    setShowSaveDialog(false);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const formatSec = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}s`;
  };

  return (
    <div className="trimmer-card">
      <div className="trimmer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Scissors size={15} color="var(--accent-turf)" />
          <span className="trimmer-title">Video Clip Cutter & Exporter</span>
        </div>

        <div className="trimmer-cut-duration">
          <span>Selected Cut:</span>
          <strong style={{ color: 'var(--accent-turf)' }}>{cutDuration.toFixed(1)}s</strong>
          <span style={{ color: 'var(--text-dim)' }}>({formatSec(inPoint)} ➔ {formatSec(outPoint)})</span>
        </div>
      </div>

      {/* In / Out Point Controls */}
      <div className="trimmer-controls-row">
        <div className="trim-point-group">
          <button 
            className="btn-ctrl btn-set-point"
            onClick={handleSetIn}
            title="Set In Point at current playback time"
          >
            <span>[ Set In: {formatSec(currentTime)}</span>
          </button>

          <input 
            type="range"
            min="0"
            max={Math.max(0.1, outPoint - 0.5)}
            step="0.1"
            value={inPoint}
            onChange={(e) => setInPoint(Number(e.target.value))}
            className="trimmer-slider"
          />
        </div>

        <div className="trim-point-group">
          <button 
            className="btn-ctrl btn-set-point"
            onClick={handleSetOut}
            title="Set Out Point at current playback time"
          >
            <span>Set Out: {formatSec(currentTime)} ]</span>
          </button>

          <input 
            type="range"
            min={inPoint + 0.5}
            max={duration || 16}
            step="0.1"
            value={outPoint}
            onChange={(e) => setOutPoint(Number(e.target.value))}
            className="trimmer-slider"
          />
        </div>

        {/* Action Buttons */}
        <div className="trim-actions-group">
          <button
            className="btn-ctrl"
            onClick={() => onPreviewCut(inPoint, outPoint)}
            title="Play only the trimmed section"
          >
            <Play size={13} fill="currentColor" />
            <span>Preview Cut</span>
          </button>

          <button
            className="btn-ctrl"
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            title="Save trimmed clip to highlight reel"
          >
            {savedSuccess ? <Check size={13} color="var(--accent-turf)" /> : <Plus size={13} />}
            <span>{savedSuccess ? 'Added to Reel' : 'Add to Reel'}</span>
          </button>

          <button
            className="btn-primary"
            onClick={() => onDownloadCut(inPoint, outPoint)}
            disabled={isCutting}
            style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}
            title="Export and download the trimmed video file directly"
          >
            <Download size={13} />
            <span>{isCutting ? `Cutting (${cutProgress}%)...` : 'Download Cut Video'}</span>
          </button>
        </div>
      </div>

      {/* Mini Dialog to Name Cut */}
      {showSaveDialog && (
        <div className="trimmer-save-popover">
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>
            Name Highlight Clip:
          </span>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            value={clipTitle}
            onChange={(e) => setClipTitle(e.target.value)}
            placeholder="e.g. Bautista Basso Corner Try"
          />
          <button 
            className="btn-primary" 
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
            onClick={handleSaveToReel}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
