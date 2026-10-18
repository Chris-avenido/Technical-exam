export type MatchPeriod = '1H' | '2H' | 'ET';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  primaryColor: string;
  secondaryColor: string;
  flagEmoji: string;
}

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
