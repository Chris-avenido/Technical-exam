export interface MatchStats {
  possession: { home: number; away: number };
  territory: { home: number; away: number };
  tackles: { homeMade: number; homeMissed: number; awayMade: number; awayMissed: number };
  scrums: { homeWon: number; homeLost: number; awayWon: number; awayLost: number };
  lineouts: { homeWon: number; homeLost: number; awayWon: number; awayLost: number };
  turnovers: { homeWon: number; awayWon: number };
  penalties: { homeConceded: number; awayConceded: number };
}
