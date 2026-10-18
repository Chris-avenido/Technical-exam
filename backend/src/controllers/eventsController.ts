import { Request, Response } from 'express';
import { mockEvents, mockTeams } from '../mockData.ts';
import { MatchEvent } from '../types.ts';

let eventsStore: MatchEvent[] = [...mockEvents];

export const getEvents = (req: Request, res: Response) => {
  const { eventType, teamId, period, search, playerId } = req.query;

  let filtered = [...eventsStore];

  if (eventType && typeof eventType === 'string' && eventType !== 'all') {
    filtered = filtered.filter(e => e.eventType === eventType);
  }

  if (teamId && typeof teamId === 'string' && teamId !== 'all') {
    filtered = filtered.filter(e => e.teamId === teamId);
  }

  if (period && typeof period === 'string' && period !== 'all') {
    filtered = filtered.filter(e => e.period === period);
  }

  if (playerId && typeof playerId === 'string' && playerId !== 'all') {
    filtered = filtered.filter(e => e.playerId === playerId);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => 
      e.description.toLowerCase().includes(q) ||
      (e.playerName && e.playerName.toLowerCase().includes(q)) ||
      e.tags.some(tag => tag.toLowerCase().includes(q))
    );
  }

  filtered.sort((a, b) => a.timestampMs - b.timestampMs);

  res.json({
    data: filtered,
    meta: {
      total: filtered.length,
      unfilteredTotal: eventsStore.length
    }
  });
};

export const createEvent = (req: Request, res: Response) => {
  const body = req.body;
  const newEvent: MatchEvent = {
    id: `evt-custom-${Date.now()}`,
    matchId: req.params.id,
    timestampMs: body.timestampMs || 0,
    gameTimeFormatted: body.gameTimeFormatted || '40:00',
    period: body.period || '1H',
    eventType: body.eventType || 'breakdown',
    teamId: body.teamId || mockTeams.home.id,
    playerId: body.playerId,
    playerName: body.playerName || 'Custom Tag',
    outcome: body.outcome || 'successful',
    pitchX: body.pitchX ?? 50,
    pitchY: body.pitchY ?? 50,
    description: body.description || 'Manual coach tag',
    clipStartSec: Math.max(0, (body.timestampMs / 1000) - 5),
    clipEndSec: (body.timestampMs / 1000) + 5,
    tags: body.tags || ['Coach Tag']
  };

  eventsStore.push(newEvent);
  res.status(201).json({ data: newEvent });
};
