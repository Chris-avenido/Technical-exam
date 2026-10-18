import { apiFetch } from './apiClient';
import { MatchEvent } from '../types';
import { mockEvents } from '../../backend/src/mockData';

let fallbackEvents = [...mockEvents];

export const eventService = {
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

      const qs = query.toString();
      return await apiFetch<MatchEvent[]>(`/matches/latest/events${qs ? `?${qs}` : ''}`);
    } catch (err) {
      console.warn('[EventService] Using fallback events', err);
      let list = [...fallbackEvents];
      if (params.eventType && params.eventType !== 'all') {
        list = list.filter(e => e.eventType === params.eventType);
      }
      if (params.teamId && params.teamId !== 'all') {
        list = list.filter(e => e.teamId === params.teamId);
      }
      if (params.period && params.period !== 'all') {
        list = list.filter(e => e.period === params.period);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(e => 
          e.description.toLowerCase().includes(q) ||
          (e.playerName && e.playerName.toLowerCase().includes(q))
        );
      }
      return list;
    }
  },

  async createEvent(eventData: Partial<MatchEvent>): Promise<MatchEvent> {
    try {
      return await apiFetch<MatchEvent>('/matches/latest/events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
    } catch (err) {
      console.warn('[EventService] Fallback createEvent', err);
      const newEvent: MatchEvent = {
        id: `evt-custom-${Date.now()}`,
        matchId: 'match-championship-2024-01',
        timestampMs: eventData.timestampMs || 0,
        gameTimeFormatted: eventData.gameTimeFormatted || '40:00',
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
      fallbackEvents.push(newEvent);
      return newEvent;
    }
  }
};
