import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MatchHeader } from './components/layout/MatchHeader';
import { VideoPlayer } from './features/video-player/VideoPlayer';
import { PitchRadar } from './features/pitch/PitchRadar';
import { EventTimeline } from './features/timeline/EventTimeline';
import { CoachingNotesPanel } from './features/coaching/CoachingNotesPanel';
import { HighlightReelPanel } from './features/reels/HighlightReelPanel';
import { AnalyticsDashboard } from './features/analytics/AnalyticsDashboard';
import { QuickTagModal } from './features/modals/QuickTagModal';
import { ExportModal } from './features/modals/ExportModal';
import { TechArchitectureModal } from './features/modals/TechArchitectureModal';

import { 
  matchService, 
  eventService, 
  coachingService, 
  reelService, 
  analyticsService 
} from './services';

import { 
  Match, 
  MatchEvent, 
  Player, 
  CoachingNote, 
  HighlightClipItem, 
  HighlightReel, 
  MatchStats 
} from './types';

export const App: React.FC = () => {
  const [match, setMatch] = useState<Match | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [notes, setNotes] = useState<CoachingNote[]>([]);
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [reels, setReels] = useState<HighlightReel[]>([]);

  // Navigation & Active View
  const [activeTab, setActiveTab] = useState<'timeline' | 'coaching' | 'reels' | 'analytics'>('timeline');
  const [selectedEvent, setSelectedEvent] = useState<MatchEvent | null>(null);
  const [seekTargetSec, setSeekTargetSec] = useState<number | null>(null);
  const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');

  // Highlight Reel Builder Queue
  const [queuedClips, setQueuedClips] = useState<HighlightClipItem[]>([]);

  // Modals
  const [isQuickTagOpen, setIsQuickTagOpen] = useState<boolean>(false);
  const [quickTagTimeSec, setQuickTagTimeSec] = useState<number>(0);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);

  // Initial Data Load
  useEffect(() => {
    const initData = async () => {
      const [m, evts, pls, nts, st, rls] = await Promise.all([
        matchService.getMatch('latest'),
        eventService.getEvents(),
        matchService.getPlayers(),
        coachingService.getNotes(),
        analyticsService.getStats(),
        reelService.getReels()
      ]);

      setMatch(m);
      setEvents(evts);
      setPlayers(pls);
      setNotes(nts);
      setStats(st);
      setReels(rls);

      // Preload default reel clips
      if (rls.length > 0 && rls[0].clips) {
        setQueuedClips(rls[0].clips);
      }
    };

    initData();
  }, []);

  // Filter effect
  useEffect(() => {
    const fetchFiltered = async () => {
      const data = await eventService.getEvents({
        search: searchQuery,
        eventType: selectedType,
        teamId: selectedTeam,
        period: selectedPeriod
      });
      setEvents(data);
    };

    fetchFiltered();
  }, [searchQuery, selectedType, selectedTeam, selectedPeriod]);

  const handleSelectEvent = (evt: MatchEvent) => {
    setSelectedEvent(evt);
    setSeekTargetSec(evt.clipStartSec);
  };

  const handleAddToReel = (evt: MatchEvent) => {
    const newClip: HighlightClipItem = {
      id: `clip-${Date.now()}`,
      eventId: evt.id,
      title: `${evt.gameTimeFormatted} · ${evt.eventType.toUpperCase()} (${evt.playerName || evt.teamId})`,
      startTimeSec: evt.clipStartSec,
      endTimeSec: evt.clipEndSec,
      teamId: evt.teamId,
      description: evt.description
    };

    setQueuedClips(prev => [...prev, newClip]);
  };

  const handleAddCustomCutToReel = (clip: { title: string; start: number; end: number }) => {
    const newClip: HighlightClipItem = {
      id: `clip-cut-${Date.now()}`,
      title: `${clip.title} (${clip.start.toFixed(1)}s - ${clip.end.toFixed(1)}s)`,
      startTimeSec: clip.start,
      endTimeSec: clip.end,
      teamId: 'team-uru',
      description: `Custom cut trimmed from ${clip.start.toFixed(1)}s to ${clip.end.toFixed(1)}s`
    };

    setQueuedClips(prev => [...prev, newClip]);
  };

  const handleRemoveClip = (id: string) => {
    setQueuedClips(prev => prev.filter(c => c.id !== id));
  };

  const handlePlayClip = (clip: HighlightClipItem) => {
    setSeekTargetSec(clip.startTimeSec);
  };

  const handleStartReelPlayback = () => {
    if (queuedClips.length === 0) return;
    setSeekTargetSec(queuedClips[0].startTimeSec);
  };

  const handleSaveNewReel = async (title: string, description: string) => {
    const newReel = await reelService.createReel({
      title,
      description,
      clips: queuedClips
    });
    setReels(prev => [...prev, newReel]);
  };

  const handleAddNote = async (noteData: Partial<CoachingNote>) => {
    const note = await coachingService.createNote(noteData);
    setNotes(prev => [note, ...prev]);
  };

  const handleDeleteNote = async (id: string) => {
    await coachingService.deleteNote(id);
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleOpenQuickTag = (currentTimeSec: number) => {
    setQuickTagTimeSec(currentTimeSec);
    setIsQuickTagOpen(true);
  };

  const handleSaveEvent = async (eventData: Partial<MatchEvent>) => {
    const newEvt = await eventService.createEvent(eventData);
    setEvents(prev => [...prev, newEvt]);
    setSelectedEvent(newEvt);
  };

  if (!match || !stats) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
        color: 'var(--accent-turf)',
        fontFamily: 'var(--font-display)',
        fontSize: '1.25rem'
      }}>
        Loading Framesports Analysis Engine...
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Responsive Navigation */}
      <Navbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        reelCount={queuedClips.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Match Banner & Responsive Scoreboard */}
      <MatchHeader match={match} />

      {/* Main Responsive Workspace Layout */}
      <main className="workspace-grid">
        {/* Left Stage: Video Player & Tactical Pitch */}
        <section className="video-stage">
          <VideoPlayer
            videoUrl={match.videoUrl}
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={handleSelectEvent}
            onOpenQuickTag={handleOpenQuickTag}
            seekTargetSec={seekTargetSec}
            onSeekCompleted={() => setSeekTargetSec(null)}
            onAddCustomClip={handleAddCustomCutToReel}
          />

          <PitchRadar
            events={events}
            selectedEvent={selectedEvent}
            onSelectEvent={handleSelectEvent}
          />
        </section>

        {/* Right Sidebar: Timeline, Coaching, Reels, Analytics */}
        <aside className="sidebar-panel">
          <div className="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline ({events.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'coaching' ? 'active' : ''}`}
              onClick={() => setActiveTab('coaching')}
            >
              Notes ({notes.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
              onClick={() => setActiveTab('reels')}
            >
              Reels ({queuedClips.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Stats
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'timeline' && (
              <EventTimeline
                events={events}
                selectedEvent={selectedEvent}
                onSelectEvent={handleSelectEvent}
                onAddToReel={handleAddToReel}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedTeam={selectedTeam}
                setSelectedTeam={setSelectedTeam}
                selectedPeriod={selectedPeriod}
                setSelectedPeriod={setSelectedPeriod}
              />
            )}

            {activeTab === 'coaching' && (
              <CoachingNotesPanel
                notes={notes}
                players={players}
                currentVideoTimeSec={currentVideoTime}
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onSeekToNote={(sec) => setSeekTargetSec(sec)}
              />
            )}

            {activeTab === 'reels' && (
              <HighlightReelPanel
                reels={reels}
                queuedClips={queuedClips}
                onRemoveClip={handleRemoveClip}
                onPlayClip={handlePlayClip}
                onStartReelPlayback={handleStartReelPlayback}
                onSaveNewReel={handleSaveNewReel}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsDashboard
                stats={stats}
                players={players}
                onSelectPlayer={(p) => {
                  setSearchQuery(p.name);
                  setActiveTab('timeline');
                }}
              />
            )}
          </div>
        </aside>
      </main>

      {/* Modals */}
      <QuickTagModal
        isOpen={isQuickTagOpen}
        onClose={() => setIsQuickTagOpen(false)}
        currentTimeSec={quickTagTimeSec}
        players={players}
        onSaveEvent={handleSaveEvent}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        match={match}
        events={events}
        notes={notes}
        stats={stats}
      />

      <TechArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />
    </div>
  );
};
