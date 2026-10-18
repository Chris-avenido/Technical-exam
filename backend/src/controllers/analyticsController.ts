import { Request, Response } from 'express';
import { mockStats } from '../mockData.ts';

export const getMatchStats = (req: Request, res: Response) => {
  res.json({ data: mockStats });
};
