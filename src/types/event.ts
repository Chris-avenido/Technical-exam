import { MatchPeriod } from './match';

export type EventType = 
  | 'try' 
  | 'conversion' 
  | 'penalty_goal' 
  | 'tackle' 
  | 'turnover' 
  | 'scrum' 
  | 'lineout' 
  | 'breakdown' 
  | 'card_yellow' 
  | 'card_red';

export type EventOutcome = 'successful' | 'missed' | 'infringement' | 'won' | 'lost' | 'neutral';

export interface MatchEvent {
  id: string;
  matchId: string;
  timestampMs: number;
  gameTimeFormatted: string;
  period: MatchPeriod;
  eventType: EventType;
  teamId: string;
  playerId?: string;
  playerName?: string;
  playerNumber?: number;
  outcome: EventOutcome;
  pitchX: number; // 0 to 100 percentage
  pitchY: number; // 0 to 100 percentage
  description: string;
  clipStartSec: number;
  clipEndSec: number;
  tags: string[];
}
