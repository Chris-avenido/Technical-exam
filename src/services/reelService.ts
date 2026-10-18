import { apiFetch } from './apiClient';
import { HighlightReel } from '../types';

let fallbackReels: HighlightReel[] = [
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

export const reelService = {
  async getReels(): Promise<HighlightReel[]> {
    try {
      return await apiFetch<HighlightReel[]>('/matches/latest/highlight_reels');
    } catch (err) {
      return fallbackReels;
    }
  },

  async createReel(reel: Partial<HighlightReel>): Promise<HighlightReel> {
    try {
      return await apiFetch<HighlightReel>('/matches/latest/highlight_reels', {
        method: 'POST',
        body: JSON.stringify(reel)
      });
    } catch (err) {
      const newReel: HighlightReel = {
        id: `reel-${Date.now()}`,
        matchId: 'match-championship-2024-01',
        title: reel.title || 'New Highlight Reel',
        description: reel.description || '',
        clips: reel.clips || [],
        createdAt: new Date().toISOString()
      };
      fallbackReels.push(newReel);
      return newReel;
    }
  }
};
