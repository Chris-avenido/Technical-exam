import { apiFetch } from './apiClient';
import { Match, Player } from '../types';
import { mockMatch, mockPlayers } from '../../backend/src/mockData';

export const matchService = {
  async getMatch(id: string = 'latest'): Promise<Match> {
    try {
      return await apiFetch<Match>(`/matches/${id}`);
    } catch (err) {
      console.warn('[MatchService] Using fallback data', err);
      return mockMatch;
    }
  },

  async getPlayers(): Promise<Player[]> {
    try {
      return await apiFetch<Player[]>('/players');
    } catch (err) {
      console.warn('[MatchService] Using fallback players', err);
      return mockPlayers;
    }
  }
};
