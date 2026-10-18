export type CoachingCategory = 
  | 'technique' 
  | 'tactical' 
  | 'positioning' 
  | 'commendation' 
  | 'discipline';

export interface CoachingNote {
  id: string;
  matchId: string;
  timestampMs: number;
  gameTimeFormatted: string;
  authorName: string;
  authorRole: string;
  category: CoachingCategory;
  taggedPlayerIds: string[];
  content: string;
  drawingData?: string;
  createdAt: string;
}
