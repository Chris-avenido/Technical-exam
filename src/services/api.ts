import { 
  Match, 
  MatchEvent, 
  CoachingNote, 
  HighlightReel, 
  MatchStats, 
  Player 
} from '../types';

import { 
  mockMatch, 
  mockEvents, 
  mockPlayers, 
  mockCoachingNotes, 
  mockStats 
} from '../../backend/src/mockData';

const BASE_URL = '/api/v1';

// In-memory fallback state if backend is offline
let localEvents = [...mockEvents];
let localNotes = [...mockCoachingNotes];
let localReels: HighlightReel[] = [
  {
    id: 'reel-best-tries',
    matchId: 'match-championship-2024-01',
    title: 'Top Tries & Crucial Turnovers',
    description: 'Curated 90-second tactical reel highlighting defensive turnovers converting to outside edge tries.',
    clips: [
      {
        id: 'clip-1',
        eventId: 'evt-2',
        title: 'Savea Jackal in Red Zone',
        startTimeSec: 20,
        endTimeSec: 30,
        teamId: 'team-nz',
        description: 'Instant turnover won under pressure'
      },
      {
        id: 'clip-2',
        eventId: 'evt-3',
        title: 'Jordan Corner Finish (Try)',
        startTimeSec: 36,
        endTimeSec: 48,
        teamId: 'team-nz',
        description: 'Decoy line created outside space'
      },
      {
        id: 'clip-3',
        eventId: 'evt-8',
        title: 'Kolbe Touchline Step (Try)',
        startTimeSec: 122,
        endTimeSec: 135,
        teamId: 'team-sa',
        description: 'World-class 5m evasion'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const apiService = {
  async getMatch(id: string = 'latest'): Promise<Match> {
    try {
      const res = await fetch(`${BASE_URL}/matches/${id}`);
      if (!res.ok) throw new Error('Failed to fetch match');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('[API Client] Backend offline or error; using local match data', err);
      return mockMatch;
    }
  },

  async getEvents(params: {
    eventType?: string;
    teamId?: string;
    period?: string;
    search?: string;
    playerId?: string;
  } = {}): Promise<MatchEvent[]> {
    try {
      const query = new URLSearchParams();
      if (params.eventType && params.eventType !== 'all') query.append('eventType', params.eventType);
      if (params.teamId && params.teamId !== 'all') query.append('teamId', params.teamId);
      if (params.period && params.period !== 'all') query.append('period', params.period);
      if (params.search) query.append('search', params.search);
      if (params.playerId && params.playerId !== 'all') query.append('playerId', params.playerId);

      const res = await fetch(`${BASE_URL}/matches/latest/events?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('[API Client] Backend offline; filtering local events', err);
      let filtered = [...localEvents];
      if (params.eventType && params.eventType !== 'all') {
        filtered = filtered.filter(e => e.eventType === params.eventType);
      }
      if (params.teamId && params.teamId !== 'all') {
        filtered = filtered.filter(e => e.teamId === params.teamId);
      }
      if (params.period && params.period !== 'all') {
        filtered = filtered.filter(e => e.period === params.period);
      }
      if (params.playerId && params.playerId !== 'all') {
        filtered = filtered.filter(e => e.playerId === params.playerId);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(e => 
          e.description.toLowerCase().includes(q) ||
          (e.playerName && e.playerName.toLowerCase().includes(q)) ||
          e.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      filtered.sort((a, b) => a.timestampMs - b.timestampMs);
      return filtered;
    }
  },

  async createEvent(eventData: Partial<MatchEvent>): Promise<MatchEvent> {
    try {
      const res = await fetch(`${BASE_URL}/matches/latest/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) throw new Error('Failed to create event');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('[API Client] Fallback event creation', err);
      const newEvent: MatchEvent = {
        id: `evt-custom-${Date.now()}`,
        matchId: 'match-championship-2024-01',
        timestampMs: eventData.timestampMs || 0,
        gameTimeFormatted: eventData.gameTimeFormatted || '30:00',
        period: eventData.period || '1H',
        eventType: eventData.eventType || 'breakdown',
        teamId: eventData.teamId || 'team-nz',
        playerId: eventData.playerId,
        playerName: eventData.playerName || 'Custom Coach Tag',
        outcome: eventData.outcome || 'successful',
        pitchX: eventData.pitchX ?? 50,
        pitchY: eventData.pitchY ?? 50,
        description: eventData.description || 'Manual coach tag',
        clipStartSec: Math.max(0, (eventData.timestampMs || 0) / 1000 - 5),
        clipEndSec: (eventData.timestampMs || 0) / 1000 + 5,
        tags: eventData.tags || ['Coach Tag'],
      };
      localEvents.push(newEvent);
      return newEvent;
    }
  },

  async getCoachingNotes(playerId?: string): Promise<CoachingNote[]> {
    try {
      const query = playerId ? `?playerId=${playerId}` : '';
      const res = await fetch(`${BASE_URL}/matches/latest/coaching_notes${query}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('[API Client] Fallback getCoachingNotes', err);
      let notes = [...localNotes];
      if (playerId) {
        notes = notes.filter(n => n.taggedPlayerIds.includes(playerId));
      }
      return notes;
    }
  },

  async createCoachingNote(noteData: Partial<CoachingNote>): Promise<CoachingNote> {
    try {
      const res = await fetch(`${BASE_URL}/matches/latest/coaching_notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(noteData),
      });
      if (!res.ok) throw new Error('Failed to create note');
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('[API Client] Fallback createCoachingNote', err);
      const newNote: CoachingNote = {
        id: `note-${Date.now()}`,
        matchId: 'match-championship-2024-01',
        timestampMs: noteData.timestampMs || 0,
        gameTimeFormatted: noteData.gameTimeFormatted || '00:00',
        authorName: noteData.authorName || 'Head Coach',
        authorRole: noteData.authorRole || 'Coaching Staff',
        category: noteData.category || 'tactical',
        taggedPlayerIds: noteData.taggedPlayerIds || [],
        content: noteData.content || '',
        drawingData: noteData.drawingData,
        createdAt: new Date().toISOString()
      };
      localNotes.unshift(newNote);
      return newNote;
    }
  },

  async deleteCoachingNote(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/v1/coaching_notes/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (err) {
      localNotes = localNotes.filter(n => n.id !== id);
      return true;
    }
  },

  async getHighlightReels(): Promise<HighlightReel[]> {
    try {
      const res = await fetch(`${BASE_URL}/matches/latest/highlight_reels`);
      if (!res.ok) throw new Error('Failed to fetch reels');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return localReels;
    }
  },

  async createHighlightReel(reel: Partial<HighlightReel>): Promise<HighlightReel> {
    try {
      const res = await fetch(`${BASE_URL}/matches/latest/highlight_reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reel),
      });
      if (!res.ok) throw new Error('Failed to create reel');
      const json = await res.json();
      return json.data;
    } catch (err) {
      const newReel: HighlightReel = {
        id: `reel-${Date.now()}`,
        matchId: 'match-championship-2024-01',
        title: reel.title || 'New Highlight Reel',
        description: reel.description || '',
        clips: reel.clips || [],
        createdAt: new Date().toISOString(),
      };
      localReels.push(newReel);
      return newReel;
    }
  },

  async getStats(): Promise<MatchStats> {
    try {
      const res = await fetch(`${BASE_URL}/matches/latest/stats`);
      if (!res.ok) throw new Error('Failed to fetch stats');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return mockStats;
    }
  },

  async getPlayers(): Promise<Player[]> {
    try {
      const res = await fetch('/api/v1/players');
      if (!res.ok) throw new Error('Failed to fetch players');
      const json = await res.json();
      return json.data;
    } catch (err) {
      return mockPlayers;
    }
  }
};
