import { Request, Response } from 'express';
import { mockCoachingNotes } from '../mockData.ts';
import { CoachingNote } from '../types.ts';

let coachingNotesStore: CoachingNote[] = [...mockCoachingNotes];

export const getCoachingNotes = (req: Request, res: Response) => {
  const { playerId } = req.query;
  let notes = [...coachingNotesStore];

  if (playerId && typeof playerId === 'string') {
    notes = notes.filter(n => n.taggedPlayerIds.includes(playerId));
  }

  notes.sort((a, b) => a.timestampMs - b.timestampMs);
  res.json({ data: notes, meta: { total: notes.length } });
};

export const createCoachingNote = (req: Request, res: Response) => {
  const body = req.body;
  if (!body.content || !body.authorName) {
    return res.status(422).json({ error: 'Content and author name are required' });
  }

  const newNote: CoachingNote = {
    id: `note-${Date.now()}`,
    matchId: req.params.id,
    timestampMs: body.timestampMs || 0,
    gameTimeFormatted: body.gameTimeFormatted || '00:00',
    authorName: body.authorName,
    authorRole: body.authorRole || 'Coaching Staff',
    category: body.category || 'tactical',
    taggedPlayerIds: body.taggedPlayerIds || [],
    content: body.content,
    drawingData: body.drawingData,
    createdAt: new Date().toISOString()
  };

  coachingNotesStore.unshift(newNote);
  res.status(201).json({ data: newNote });
};

export const deleteCoachingNote = (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = coachingNotesStore.length;
  coachingNotesStore = coachingNotesStore.filter(n => n.id !== id);

  if (coachingNotesStore.length < initialLength) {
    res.json({ success: true, message: 'Note deleted' });
  } else {
    res.status(404).json({ error: 'Note not found' });
  }
};
