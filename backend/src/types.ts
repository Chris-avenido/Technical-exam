export type MatchPeriod = '1H' | '2H' | 'ET';

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

export interface Player {
  id: string;
  teamId: string;
  number: number;
  name: string;
  position: string;
  avatar?: string;
  tacklesCount?: number;
  metresCarried?: number;
  turnoversWon?: number;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  flagEmoji: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  timestampMs: number; // Video timestamp in ms
  gameTimeFormatted: string; // e.g. "23:45"
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

export type CoachingCategory = 'technique' | 'tactical' | 'positioning' | 'commendation' | 'discipline';

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
  drawingData?: string; // Serialized canvas overlay lines/arrows
  createdAt: string;
}

export interface HighlightClipItem {
  id: string;
  eventId?: string;
  title: string;
  startTimeSec: number;
  endTimeSec: number;
  teamId: string;
  description: string;
}

export interface HighlightReel {
  id: string;
  matchId: string;
  title: string;
  description: string;
  clips: HighlightClipItem[];
  createdAt: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  territory: { home: number; away: number };
  tackles: { homeMade: number; homeMissed: number; awayMade: number; awayMissed: number };
  scrums: { homeWon: number; homeLost: number; awayWon: number; awayLost: number };
  lineouts: { homeWon: number; homeLost: number; awayWon: number; awayLost: number };
  turnovers: { homeWon: number; awayWon: number };
  penalties: { homeConceded: number; awayConceded: number };
}

export interface Match {
  id: string;
  title: string;
  competition: string;
  round: string;
  matchDate: string;
  venue: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  durationSeconds: number;
  videoUrl: string;
  eventsCount: number;
}
