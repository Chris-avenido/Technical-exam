import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Edit3, 
  Trash2, 
  Tag, 
  Repeat, 
  Volume2, 
  VolumeX,
  Upload,
  Tv,
  Film,
  Scissors
} from 'lucide-react';
import { MatchEvent } from '../../types';
import { VideoTrimmer } from './VideoTrimmer';

interface VideoPlayerProps {
  videoUrl: string;
  events: MatchEvent[];
  selectedEvent: MatchEvent | null;
  onSelectEvent: (event: MatchEvent) => void;
  onOpenQuickTag: (currentTimeSec: number) => void;
  seekTargetSec: number | null;
  onSeekCompleted: () => void;
  onSaveDrawing?: (dataUrl: string) => void;
  onAddCustomClip?: (clip: { title: string; start: number; end: number }) => void;
}

const FALLBACK_VIDEOS = [
  '/rugby_match.webm',
  'https://upload.wikimedia.org/wikipedia/commons/4/46/2023_Rugby_World_Cup_warm-up_matches_-_Uruguay_vs_Chile_-_Video_1.webm',
  'https://vjs.zencdn.net/v/oceans.mp4'
];

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  events,
  selectedEvent,
  onSelectEvent,
  onOpenQuickTag,
  seekTargetSec,
  onSeekCompleted,
  onSaveDrawing,
  onAddCustomClip
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const simCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Playback mode: 'video' or 'simulation'
  const [playerMode, setPlayerMode] = useState<'video' | 'simulation'>('video');
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>(videoUrl || FALLBACK_VIDEOS[0]);
  const [fallbackIndex, setFallbackIndex] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(15.8);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLoopingClip, setIsLoopingClip] = useState<boolean>(false);
  const [activeClipRange, setActiveClipRange] = useState<{ start: number; end: number } | null>(null);

  // Video Cutter / Trimmer state
  const [showTrimmer, setShowTrimmer] = useState<boolean>(true);
  const [inPoint, setInPoint] = useState<number>(2.0);
  const [outPoint, setOutPoint] = useState<number>(14.5);
  const [isCutting, setIsCutting] = useState<boolean>(false);
  const [cutProgress, setCutProgress] = useState<number>(0);

  // Telestration Drawing state
  const [isDrawingMode, setIsDrawingMode] = useState<boolean>(false);
  const [drawColor, setDrawColor] = useState<string>('#00e599');
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [hoveredEvent, setHoveredEvent] = useState<MatchEvent | null>(null);

  useEffect(() => {
    if (videoUrl) {
      setCurrentVideoSrc(videoUrl);
      setVideoError(false);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (seekTargetSec !== null) {
      if (videoRef.current && playerMode === 'video') {
        videoRef.current.currentTime = seekTargetSec;
      }
      setCurrentTime(seekTargetSec);
      if (selectedEvent) {
        setActiveClipRange({
          start: selectedEvent.clipStartSec,
          end: selectedEvent.clipEndSec
        });
      }
      onSeekCompleted();
    }
  }, [seekTargetSec, selectedEvent, playerMode, onSeekCompleted]);

  const handleVideoError = () => {
    console.warn(`[VideoPlayer] Error loading video: ${currentVideoSrc}`);
    const nextIdx = fallbackIndex + 1;
    if (nextIdx < FALLBACK_VIDEOS.length) {
      setFallbackIndex(nextIdx);
      setCurrentVideoSrc(FALLBACK_VIDEOS[nextIdx]);
    } else {
      setVideoError(true);
      setPlayerMode('simulation');
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current || playerMode !== 'video') return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Loop active clip or trimmed preview range
    if (isLoopingClip && activeClipRange) {
      if (curr >= activeClipRange.end) {
        videoRef.current.currentTime = activeClipRange.start;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
        if (outPoint > dur) {
          setOutPoint(Number((dur * 0.95).toFixed(1)));
        }
      }
    }
  };

  // Simulation timer loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        if (playerMode === 'simulation') {
          setCurrentTime(prev => {
            let next = prev + dt * playbackRate;
            if (isLoopingClip && activeClipRange && next >= activeClipRange.end) {
              return activeClipRange.start;
            }
            if (next >= duration) return 0;
            return next;
          });
        }
      }

      if (playerMode === 'simulation' && simCanvasRef.current) {
        renderSimulationFrame(simCanvasRef.current, currentTime, selectedEvent);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playerMode, playbackRate, isLoopingClip, activeClipRange, duration, currentTime, selectedEvent]);

  // Render Uruguay vs Chile Rugby Simulation
  const renderSimulationFrame = (canvas: HTMLCanvasElement, timeSec: number, event: MatchEvent | null) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    // Pitch Grass Background
    ctx.fillStyle = '#0b2917';
    ctx.fillRect(0, 0, w, h);

    // Stripes
    ctx.fillStyle = '#0e331d';
    for (let x = 0; x < w; x += 60) {
      ctx.fillRect(x, 0, 30, h);
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 20, w - 60, h - 40);

    // Halfway
    ctx.beginPath();
    ctx.moveTo(w / 2, 20);
    ctx.lineTo(w / 2, h - 20);
    ctx.stroke();

    // 22m lines
    const left22 = 30 + (w - 60) * 0.22;
    const right22 = 30 + (w - 60) * 0.78;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(left22, 20);
    ctx.lineTo(left22, h - 20);
    ctx.moveTo(right22, 20);
    ctx.lineTo(right22, h - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    // Try Lines
    ctx.fillStyle = 'rgba(0, 127, 255, 0.1)';
    ctx.fillRect(30, 20, (w - 60) * 0.08, h - 40);
    ctx.fillStyle = 'rgba(213, 43, 30, 0.1)';
    ctx.fillRect(w - 30 - (w - 60) * 0.08, 20, (w - 60) * 0.08, h - 40);

    const cycle = (timeSec % 8) / 8;
    const ballBaseX = event ? (event.pitchX / 100) * (w - 100) + 50 : (w / 2) + Math.sin(cycle * Math.PI * 2) * 160;
    const ballBaseY = event ? (event.pitchY / 100) * (h - 80) + 40 : (h / 2) + Math.cos(cycle * Math.PI * 2) * 60;

    // Uruguay Players (Sky Blue Kits)
    const uruPositions = [
      { x: ballBaseX - 35, y: ballBaseY - 15, num: 9, name: 'Arata' },
      { x: ballBaseX - 60, y: ballBaseY + 10, num: 10, name: 'Etcheverry' },
      { x: ballBaseX - 85, y: ballBaseY + 35, num: 12, name: 'Vilaseca' },
      { x: ballBaseX + (Math.sin(cycle * 3) * 20), y: ballBaseY - 55, num: 14, name: 'Basso' }
    ];

    uruPositions.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#007fff'; // Uruguay Sky Blue
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.num.toString(), p.x, p.y + 3);
    });

    // Chile Players (Red Kits)
    const chiPositions = [
      { x: ballBaseX + 35, y: ballBaseY - 10, num: 7, name: 'Saavedra' },
      { x: ballBaseX + 60, y: ballBaseY + 20, num: 6, name: 'Sigren' },
      { x: ballBaseX + 85, y: ballBaseY - 45, num: 15, name: 'Ayarza' }
    ];

    chiPositions.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#d52b1e'; // Chile Red
      ctx.fill();
      ctx.strokeStyle = '#002b49';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(p.num.toString(), p.x, p.y + 3);
    });

    // Rugby Ball
    ctx.save();
    ctx.translate(ballBaseX, ballBaseY);
    ctx.rotate(-0.3 + Math.sin(timeSec * 5) * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#00d2ff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Broadcast HUD
    ctx.fillStyle = 'rgba(7, 10, 19, 0.85)';
    ctx.strokeStyle = 'rgba(0, 127, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(40, 30, 420, 50, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#00e599';
    ctx.font = 'bold 10px JetBrains Mono, monospace';
    ctx.textAlign = 'left';
    ctx.fillText('URUGUAY (LOS TEROS) vs CHILE (LOS CÓNDORES) · ESTADIO CHARRÚA', 52, 46);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Outfit, sans-serif';
    const eventText = event 
      ? `${event.gameTimeFormatted} | ${event.eventType.toUpperCase()} - ${event.playerName || ''} (${event.teamId === 'team-uru' ? 'URU' : 'CHI'})`
      : 'MIDFIELD BREAKDOWN & TOUCHLINE CORNER TRY ATTACK';
    ctx.fillText(eventText, 52, 66);
  };

  const togglePlay = () => {
    if (playerMode === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        if (isDrawingMode) setIsDrawingMode(false);
        videoRef.current.play().catch(e => {
          console.warn('Fallback to simulation', e);
          setPlayerMode('simulation');
        });
        setIsPlaying(true);
      }
    } else {
      if (isDrawingMode) setIsDrawingMode(false);
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setPlaybackRate(rate);
  };

  const stepFrame = (deltaSec: number) => {
    if (videoRef.current && playerMode === 'video') {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    const newTime = Math.max(0, Math.min(duration, currentTime + deltaSec));
    if (videoRef.current && playerMode === 'video') {
      videoRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const target = pct * duration;

    if (videoRef.current && playerMode === 'video') {
      videoRef.current.currentTime = target;
    }
    setCurrentTime(target);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Preview the selected Cut slice
  const handlePreviewCut = (inPt: number, outPt: number) => {
    if (videoRef.current && playerMode === 'video') {
      videoRef.current.currentTime = inPt;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
    setCurrentTime(inPt);
    setActiveClipRange({ start: inPt, end: outPt });
    setIsLoopingClip(true);
  };

  // Save Cut as Highlight Reel Clip
  const handleSaveCutToReel = (title: string, inPt: number, outPt: number) => {
    if (onAddCustomClip) {
      onAddCustomClip({ title, start: inPt, end: outPt });
    }
  };

  // Real client-side Video Trimming and Export
  const handleDownloadCut = async (inPt: number, outPt: number) => {
    if (!videoRef.current) return;
    setIsCutting(true);
    setCutProgress(15);

    try {
      const video = videoRef.current;
      const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream?.();

      if (!stream) {
        // Direct clip download fallback
        const a = document.createElement('a');
        a.href = currentVideoSrc;
        a.download = `uruguay-chile-cut-${inPt.toFixed(1)}s-to-${outPt.toFixed(1)}s.webm`;
        a.click();
        setIsCutting(false);
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `uruguay-chile-cut-${inPt.toFixed(1)}s-to-${outPt.toFixed(1)}s.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsCutting(false);
        setCutProgress(100);
      };

      video.currentTime = inPt;
      await video.play();
      recorder.start();

      const cutDurationMs = Math.max(500, (outPt - inPt) * 1000);
      const startTime = Date.now();

      const progressInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min(95, Math.round((elapsed / cutDurationMs) * 100));
        setCutProgress(pct);
      }, 150);

      setTimeout(() => {
        clearInterval(progressInterval);
        video.pause();
        recorder.stop();
      }, cutDurationMs);

    } catch (err) {
      console.warn('Client trim fallback', err);
      const a = document.createElement('a');
      a.href = currentVideoSrc;
      a.download = `uruguay-chile-cut-${inPt.toFixed(1)}s-to-${outPt.toFixed(1)}s.webm`;
      a.click();
      setIsCutting(false);
    }
  };

  // Local Video Upload
  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setCurrentVideoSrc(localUrl);
      setPlayerMode('video');
      setVideoError(false);
      if (videoRef.current) {
        videoRef.current.src = localUrl;
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Telestration Drawing
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsPainting(true);
  };

  const drawMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPainting || !isDrawingMode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isPainting) return;
    setIsPainting(false);
    if (canvasRef.current && onSaveDrawing) {
      onSaveDrawing(canvasRef.current.toDataURL());
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const toggleDrawingMode = () => {
    if (!isDrawingMode) {
      if (videoRef.current && playerMode === 'video') videoRef.current.pause();
      setIsPlaying(false);
    }
    setIsDrawingMode(!isDrawingMode);
  };

  const formatTimecode = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="video-player-card">
      {/* Top Engine & Cutter Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.45rem 1rem',
        background: 'rgba(7, 10, 19, 0.7)',
        borderBottom: '1px solid var(--border-subtle)',
        fontSize: '0.75rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={() => setPlayerMode('video')}
            className={`btn-ctrl ${playerMode === 'video' ? 'active' : ''}`}
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
            title="Real Rugby Match Video Footage"
          >
            <Film size={12} />
            <span>📹 Real Match Video</span>
          </button>

          <button
            onClick={() => setPlayerMode('simulation')}
            className={`btn-ctrl ${playerMode === 'simulation' ? 'active' : ''}`}
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
            title="2D Tactical Rugby Simulation"
          >
            <Tv size={12} />
            <span>🏉 2D Simulation</span>
          </button>

          <button
            onClick={() => setShowTrimmer(!showTrimmer)}
            className={`btn-ctrl ${showTrimmer ? 'active' : ''}`}
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem', borderColor: 'var(--accent-turf)', color: 'var(--accent-turf)' }}
            title="Toggle Video Clipper / Cutter Panel"
          >
            <Scissors size={12} />
            <span>✂️ Cut Video Tool</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleLocalVideoUpload}
          />
          <button
            className="btn-ctrl"
            style={{ padding: '0.25rem 0.55rem', fontSize: '0.72rem' }}
            onClick={() => fileInputRef.current?.click()}
            title="Load any local MP4 match footage from your device"
          >
            <Upload size={12} />
            <span className="btn-text">Load Local Match MP4</span>
          </button>
        </div>
      </div>

      <div className="video-wrapper">
        {/* Mode 1: Video Feed */}
        {playerMode === 'video' && (
          <video
            ref={videoRef}
            src={currentVideoSrc}
            className="main-video"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={handleVideoError}
            preload="auto"
            muted={isMuted}
            playsInline
          />
        )}

        {/* Mode 2: Tactical 60FPS Rugby Simulation Engine */}
        {playerMode === 'simulation' && (
          <canvas
            ref={simCanvasRef}
            width={960}
            height={540}
            className="main-video"
            style={{ background: '#0b2917' }}
          />
        )}

        {/* Responsive Telestration Canvas Overlay */}
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className={`telestration-canvas ${isDrawingMode ? 'active' : ''}`}
          onMouseDown={startDrawing}
          onMouseMove={drawMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {isDrawingMode && (
          <div className="telestration-overlay-hint">
            <Edit3 size={13} />
            <span>Telestration Active — Draw directly over frame</span>
          </div>
        )}
      </div>

      {/* Scrubber and Timeline Markers with Highlight Cut Zone */}
      <div className="timeline-container">
        <div 
          className="scrubber-track" 
          onClick={handleScrubberClick}
          title="Click to seek"
        >
          {/* Highlight Cut Slice Zone on the seek bar */}
          {showTrimmer && (
            <div
              className="scrubber-cut-slice"
              style={{
                left: `${(inPoint / (duration || 1)) * 100}%`,
                width: `${Math.max(2, ((outPoint - inPoint) / (duration || 1)) * 100)}%`
              }}
              title={`Active Cut: ${inPoint.toFixed(1)}s - ${outPoint.toFixed(1)}s`}
            />
          )}

          <div 
            className="scrubber-progress" 
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          <div 
            className="scrubber-thumb" 
            style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
          />

          {/* Color-coded event markers on seek bar */}
          {events.map((evt) => {
            const pct = Math.min(100, (evt.timestampMs / 1000 / (duration || 1)) * 100);
            let markerClass = 'marker-try';
            if (evt.eventType === 'tackle') markerClass = 'marker-tackle';
            if (evt.eventType === 'turnover') markerClass = 'marker-turnover';
            if (evt.eventType === 'penalty_goal' || evt.eventType === 'breakdown') markerClass = 'marker-penalty';
            if (evt.eventType === 'scrum' || evt.eventType === 'lineout') markerClass = 'marker-scrum';

            return (
              <div
                key={evt.id}
                className={`timeline-marker ${markerClass}`}
                style={{ left: `${pct}%` }}
                onMouseEnter={() => setHoveredEvent(evt)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectEvent(evt);
                }}
                title={`${evt.gameTimeFormatted} · ${evt.eventType.toUpperCase()} · ${evt.playerName || ''}`}
              />
            );
          })}
        </div>

        {/* Hover preview tooltip */}
        {hoveredEvent && (
          <div className="hover-preview-tooltip">
            <span style={{ color: 'var(--accent-turf)', fontWeight: 700 }}>{hoveredEvent.gameTimeFormatted}</span>
            <span>{hoveredEvent.eventType.toUpperCase()}: {hoveredEvent.description}</span>
          </div>
        )}

        {/* Responsive Bottom Control Bar */}
        <div className="control-bar">
          {/* Group 1: Playback & Frame Steps */}
          <div className="control-group">
            <button className="btn-primary" onClick={togglePlay} style={{ padding: '0.45rem 0.8rem' }}>
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span className="btn-text">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button className="btn-ctrl" onClick={() => stepFrame(-0.1)} title="Step Back 1 Frame (-0.1s)">
              <SkipBack size={14} />
              <span className="btn-text">-0.1s</span>
            </button>

            <button className="btn-ctrl" onClick={() => stepFrame(0.1)} title="Step Forward 1 Frame (+0.1s)">
              <SkipForward size={14} />
              <span className="btn-text">+0.1s</span>
            </button>

            <span className="timecode">
              {formatTimecode(currentTime)} / {formatTimecode(duration)}
            </span>
          </div>

          {/* Group 2: Speeds & Loop Mode */}
          <div className="control-group desktop-controls">
            {[0.5, 1.0, 1.5, 2.0].map((rate) => (
              <button
                key={rate}
                className={`btn-ctrl speed-btn ${playbackRate === rate ? 'active' : ''}`}
                onClick={() => changeSpeed(rate)}
              >
                {rate}x
              </button>
            ))}

            <button 
              className={`btn-ctrl ${isLoopingClip ? 'active' : ''}`}
              onClick={() => setIsLoopingClip(!isLoopingClip)}
              title="Loop active event clip interval"
            >
              <Repeat size={14} />
              <span className="btn-text">Loop</span>
            </button>
          </div>

          {/* Group 3: Telestration, Mute, Quick Tag */}
          <div className="control-group">
            <button 
              className={`btn-ctrl ${isDrawingMode ? 'active' : ''}`}
              onClick={toggleDrawingMode}
              title="Draw telestration on frame"
            >
              <Edit3 size={14} />
              <span className="btn-text">Draw</span>
            </button>

            {isDrawingMode && (
              <div className="draw-palette">
                {['#00e599', '#ffb800', '#00d2ff'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setDrawColor(c)}
                    className="palette-color-btn"
                    style={{
                      background: c,
                      border: drawColor === c ? '2px solid #fff' : 'none'
                    }}
                    title={`Color ${c}`}
                  />
                ))}
                <button className="btn-ctrl" onClick={clearCanvas} title="Clear Drawing">
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            {playerMode === 'video' && (
              <button className="btn-ctrl" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
            )}

            <button 
              className="btn-ctrl btn-tag-moment" 
              onClick={() => onOpenQuickTag(currentTime)}
              title="Tag match event at current time"
            >
              <Tag size={14} />
              <span className="btn-text">Tag Moment</span>
            </button>
          </div>
        </div>

        {/* Dedicated Video Trimmer & Clip Cutter Bar */}
        {showTrimmer && (
          <VideoTrimmer
            currentTime={currentTime}
            duration={duration}
            inPoint={inPoint}
            outPoint={outPoint}
            setInPoint={setInPoint}
            setOutPoint={setOutPoint}
            onPreviewCut={handlePreviewCut}
            onSaveCutToReel={handleSaveCutToReel}
            onDownloadCut={handleDownloadCut}
            isCutting={isCutting}
            cutProgress={cutProgress}
          />
        )}
      </div>
    </div>
  );
};
