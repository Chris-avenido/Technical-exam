import { Router } from 'express';
import { getMatches, getMatchById } from '../controllers/matchesController.ts';
import { getEvents, createEvent } from '../controllers/eventsController.ts';
import { getCoachingNotes, createCoachingNote, deleteCoachingNote } from '../controllers/coachingNotesController.ts';
import { getHighlightReels, createHighlightReel } from '../controllers/highlightReelsController.ts';
import { getMatchStats } from '../controllers/analyticsController.ts';
import { getPlayers } from '../controllers/playersController.ts';

const router = Router();

// Matches
router.get('/matches', getMatches);
router.get('/matches/:id', getMatchById);

// Events
router.get('/matches/:id/events', getEvents);
router.post('/matches/:id/events', createEvent);

// Coaching Notes
router.get('/matches/:id/coaching_notes', getCoachingNotes);
router.post('/matches/:id/coaching_notes', createCoachingNote);
router.delete('/coaching_notes/:id', deleteCoachingNote);

// Highlight Reels
router.get('/matches/:id/highlight_reels', getHighlightReels);
router.post('/matches/:id/highlight_reels', createHighlightReel);

// Analytics
router.get('/matches/:id/stats', getMatchStats);

// Players
router.get('/players', getPlayers);

export default router;
