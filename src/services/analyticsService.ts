import { apiFetch } from './apiClient';
import { MatchStats } from '../types';
import { mockStats } from '../../backend/src/mockData';

export const analyticsService = {
  async getStats(): Promise<MatchStats> {
    try {
      return await apiFetch<MatchStats>('/matches/latest/stats');
    } catch (err) {
      return mockStats;
    }
  }
};
