import { apiFetch } from './apiClient';
import { CoachingNote } from '../types';
import { mockCoachingNotes } from '../../backend/src/mockData';

let fallbackNotes = [...mockCoachingNotes];

export const coachingService = {
  async getNotes(playerId?: string): Promise<CoachingNote[]> {
    try {
      const qs = playerId ? `?playerId=${playerId}` : '';
      return await apiFetch<CoachingNote[]>(`/matches/latest/coaching_notes${qs}`);
    } catch (err) {
      console.warn('[CoachingService] Using fallback notes', err);
      let list = [...fallbackNotes];
      if (playerId) {
        list = list.filter(n => n.taggedPlayerIds.includes(playerId));
      }
      return list;
    }
  },

  async createNote(noteData: Partial<CoachingNote>): Promise<CoachingNote> {
    try {
      return await apiFetch<CoachingNote>('/matches/latest/coaching_notes', {
        method: 'POST',
        body: JSON.stringify(noteData)
      });
    } catch (err) {
      console.warn('[CoachingService] Fallback createNote', err);
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
      fallbackNotes.unshift(newNote);
      return newNote;
    }
  },

  async deleteNote(id: string): Promise<boolean> {
    try {
      await apiFetch<{ success: boolean }>(`/coaching_notes/${id}`, { method: 'DELETE' });
      return true;
    } catch (err) {
      fallbackNotes = fallbackNotes.filter(n => n.id !== id);
      return true;
    }
  }
};
