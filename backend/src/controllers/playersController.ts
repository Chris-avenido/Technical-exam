import { Request, Response } from 'express';
import { mockPlayers } from '../mockData.ts';

export const getPlayers = (req: Request, res: Response) => {
  res.json({ data: mockPlayers });
};
