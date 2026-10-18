import { Request, Response } from 'express';
import { HighlightReel } from '../types.ts';

let highlightReelsStore: HighlightReel[] = [
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

export const getHighlightReels = (req: Request, res: Response) => {
  res.json({ data: highlightReelsStore });
};

export const createHighlightReel = (req: Request, res: Response) => {
  const body = req.body;
  const newReel: HighlightReel = {
    id: `reel-${Date.now()}`,
    matchId: req.params.id,
    title: body.title || 'New Highlight Reel',
    description: body.description || '',
    clips: body.clips || [],
    createdAt: new Date().toISOString()
  };

  highlightReelsStore.push(newReel);
  res.status(201).json({ data: newReel });
};
