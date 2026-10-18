import { Request, Response } from 'express';
import { mockMatch } from '../mockData.ts';

export const getMatches = (req: Request, res: Response) => {
  res.json({
    data: [mockMatch],
    meta: { total: 1 }
  });
};

export const getMatchById = (req: Request, res: Response) => {
  if (req.params.id === mockMatch.id || req.params.id === 'latest') {
    res.json({ data: mockMatch });
  } else {
    res.status(404).json({ error: 'Match not found' });
  }
};
