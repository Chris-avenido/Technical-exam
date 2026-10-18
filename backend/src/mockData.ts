import { Match, MatchEvent, Player, CoachingNote, MatchStats } from './types.ts';

export const mockTeams = {
  home: {
    id: 'team-uru',
    name: 'Uruguay Los Teros',
    shortName: 'URU',
    primaryColor: '#007fff',
    secondaryColor: '#ffffff',
    flagEmoji: '🇺🇾'
  },
  away: {
    id: 'team-chi',
    name: 'Chile Los Cóndores',
    shortName: 'CHI',
    primaryColor: '#d52b1e',
    secondaryColor: '#002b49',
    flagEmoji: '🇨🇱'
  }
};

export const mockPlayers: Player[] = [
  // Uruguay Players (Video: Sky blue jerseys, white shorts)
  { id: 'uru-9', teamId: 'team-uru', number: 9, name: 'Santiago Arata', position: 'Scrum Half', metresCarried: 34, tacklesCount: 8, turnoversWon: 1 },
  { id: 'uru-10', teamId: 'team-uru', number: 10, name: 'Felipe Etcheverry', position: 'Fly Half', metresCarried: 48, tacklesCount: 6, turnoversWon: 1 },
  { id: 'uru-14', teamId: 'team-uru', number: 14, name: 'Bautista Basso', position: 'Right Wing (Try Scorer)', metresCarried: 86, tacklesCount: 5, turnoversWon: 0 },
  { id: 'uru-12', teamId: 'team-uru', number: 12, name: 'Andrés Vilaseca', position: 'Inside Centre (Captain)', metresCarried: 58, tacklesCount: 14, turnoversWon: 2 },
  { id: 'uru-6', teamId: 'team-uru', number: 6, name: 'Manuel Ardao', position: 'Flanker (Jackal Specialist)', metresCarried: 42, tacklesCount: 18, turnoversWon: 4 },
  { id: 'uru-8', teamId: 'team-uru', number: 8, name: 'Manuel Diana', position: 'Number Eight', metresCarried: 52, tacklesCount: 12, turnoversWon: 1 },
  { id: 'uru-2', teamId: 'team-uru', number: 2, name: 'Germán Kessler', position: 'Hooker', metresCarried: 28, tacklesCount: 15, turnoversWon: 1 },
  { id: 'uru-1', teamId: 'team-uru', number: 1, name: 'Mateo Sanguinetti', position: 'Loosehead Prop', metresCarried: 22, tacklesCount: 11, turnoversWon: 0 },

  // Chile Players (Video: Red jerseys, navy shorts)
  { id: 'chi-6', teamId: 'team-chi', number: 6, name: 'Martín Sigren', position: 'Flanker (Captain)', metresCarried: 46, tacklesCount: 19, turnoversWon: 2 },
  { id: 'chi-7', teamId: 'team-chi', number: 7, name: 'Clemente Saavedra', position: 'Blindside Flanker', metresCarried: 38, tacklesCount: 17, turnoversWon: 2 },
  { id: 'chi-15', teamId: 'team-chi', number: 15, name: 'Iñaki Ayarza', position: 'Fullback (Cover Tackle)', metresCarried: 64, tacklesCount: 9, turnoversWon: 0 },
  { id: 'chi-10', teamId: 'team-chi', number: 10, name: 'Rodrigo Fernández', position: 'Fly Half', metresCarried: 55, tacklesCount: 7, turnoversWon: 1 },
  { id: 'chi-9', teamId: 'team-chi', number: 9, name: 'Marcelo Torrealba', position: 'Scrum Half', metresCarried: 20, tacklesCount: 10, turnoversWon: 1 },
  { id: 'chi-13', teamId: 'team-chi', number: 13, name: 'Domingo Saavedra', position: 'Outside Centre', metresCarried: 36, tacklesCount: 12, turnoversWon: 0 },
  { id: 'chi-3', teamId: 'team-chi', number: 3, name: 'Matías Dittus', position: 'Tighthead Prop', metresCarried: 24, tacklesCount: 13, turnoversWon: 1 },
  { id: 'chi-14', teamId: 'team-chi', number: 14, name: 'Cristóbal Game', position: 'Right Wing', metresCarried: 42, tacklesCount: 6, turnoversWon: 0 }
];

export const mockMatch: Match = {
  id: 'match-rwc-uru-chi-2023',
  title: 'Rugby World Cup 2023: Uruguay vs Chile',
  competition: 'Rugby World Cup Warm-Up Series',
  round: 'Test Match',
  matchDate: '2023-07-29',
  venue: 'Estadio Charrúa, Montevideo, Uruguay',
  homeTeam: mockTeams.home,
  awayTeam: mockTeams.away,
  homeScore: 26,
  awayScore: 25,
  durationSeconds: 15.8, // Exact duration of this genuine World Cup match video clip
  videoUrl: '/rugby_match.webm',
  eventsCount: 6
};

// Exact play-by-play events matching the action in the video:
export const mockEvents: MatchEvent[] = [
  {
    id: 'evt-1',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 1200, // 00:01.2
    gameTimeFormatted: '22:15',
    period: '1H',
    eventType: 'breakdown',
    teamId: 'team-uru',
    playerId: 'uru-9',
    playerName: 'Santiago Arata',
    playerNumber: 9,
    outcome: 'successful',
    pitchX: 42,
    pitchY: 55,
    description: 'Rapid 1.6s ruck delivery from Arata launching phase attack from the midfield platform.',
    clipStartSec: 0,
    clipEndSec: 3.2,
    tags: ['Midfield Phase', 'Quick Ruck Delivery', 'Tempo']
  },
  {
    id: 'evt-2',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 3600, // 00:03.6
    gameTimeFormatted: '22:18',
    period: '1H',
    eventType: 'tackle',
    teamId: 'team-chi',
    playerId: 'chi-7',
    playerName: 'Clemente Saavedra',
    playerNumber: 7,
    outcome: 'successful',
    pitchX: 54,
    pitchY: 48,
    description: 'Chilean flanker Saavedra makes dominant gainline hit against the crash ball runner.',
    clipStartSec: 2.2,
    clipEndSec: 5.5,
    tags: ['Dominant Tackle', 'Gainline Defense', 'Collision']
  },
  {
    id: 'evt-3',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 6400, // 00:06.4
    gameTimeFormatted: '22:21',
    period: '1H',
    eventType: 'turnover',
    teamId: 'team-uru',
    playerId: 'uru-6',
    playerName: 'Manuel Ardao',
    playerNumber: 6,
    outcome: 'won',
    pitchX: 62,
    pitchY: 40,
    description: 'Ardao secures counter-ruck ball, preventing Chilean defensive jackal contest.',
    clipStartSec: 5.0,
    clipEndSec: 8.5,
    tags: ['Breakdown Retention', 'Counter-Ruck', 'Continuity']
  },
  {
    id: 'evt-4',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 9500, // 00:09.5
    gameTimeFormatted: '22:24',
    period: '1H',
    eventType: 'scrum',
    teamId: 'team-uru',
    playerId: 'uru-10',
    playerName: 'Felipe Etcheverry',
    playerNumber: 10,
    outcome: 'successful',
    pitchX: 74,
    pitchY: 65,
    description: 'Decoy line from Vilaseca creates 3-on-2 overlap, Etcheverry throws flat skip pass to wing.',
    clipStartSec: 8.0,
    clipEndSec: 12.0,
    tags: ['Decoy Line', 'Skip Pass', 'Overlap Attack']
  },
  {
    id: 'evt-5',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 12200, // 00:12.2
    gameTimeFormatted: '22:27',
    period: '1H',
    eventType: 'lineout',
    teamId: 'team-uru',
    playerId: 'uru-14',
    playerName: 'Bautista Basso',
    playerNumber: 14,
    outcome: 'successful',
    pitchX: 88,
    pitchY: 82,
    description: 'Basso accelerates along 5m touchline corridor, brushing past initial tackle attempt.',
    clipStartSec: 10.5,
    clipEndSec: 14.5,
    tags: ['Line Break', 'Sprint', 'Fend']
  },
  {
    id: 'evt-6',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 14600, // 00:14.6
    gameTimeFormatted: '22:29',
    period: '1H',
    eventType: 'try',
    teamId: 'team-uru',
    playerId: 'uru-14',
    playerName: 'Bautista Basso',
    playerNumber: 14,
    outcome: 'successful',
    pitchX: 97,
    pitchY: 90,
    description: 'SENSATIONAL CORNER TRY! Bautista Basso dives acrobatically into the corner flag as Ayarza covers across!',
    clipStartSec: 12.0,
    clipEndSec: 15.8,
    tags: ['TRY', 'Corner Finish', 'Highlight', 'Acrobatic Grounding']
  }
];

export const mockCoachingNotes: CoachingNote[] = [
  {
    id: 'note-1',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 3600,
    gameTimeFormatted: '22:18',
    authorName: 'Ori (Performance Director)',
    authorRole: 'Head of Technical Analysis',
    category: 'technique',
    taggedPlayerIds: ['chi-7', 'uru-12'],
    content: 'Notice Saavedra’s body height at contact point (00:03.6). Excellent shoulder drive stopping immediate offload.',
    createdAt: '2023-07-29T19:30:00Z'
  },
  {
    id: 'note-2',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 9500,
    gameTimeFormatted: '22:24',
    authorName: 'Backline Coach',
    authorRole: 'Assistant Coach',
    category: 'tactical',
    taggedPlayerIds: ['uru-10', 'uru-14'],
    content: 'The skip pass from Etcheverry caught Chile drifting too aggressively. Perfect spatial execution to put Basso in space.',
    createdAt: '2023-07-29T19:45:00Z'
  },
  {
    id: 'note-3',
    matchId: 'match-rwc-uru-chi-2023',
    timestampMs: 14600,
    gameTimeFormatted: '22:29',
    authorName: 'Head Coach',
    authorRole: 'Head Coach',
    category: 'commendation',
    taggedPlayerIds: ['uru-14'],
    content: 'World-class corner grounding technique. Basso keeps his torso and feet suspended over touchline while grounding ball cleanly inside.',
    createdAt: '2023-07-29T20:10:00Z'
  }
];

export const mockStats: MatchStats = {
  possession: { home: 56, away: 44 }, // Uruguay 56% - Chile 44%
  territory: { home: 53, away: 47 },
  tackles: { homeMade: 128, homeMissed: 14, awayMade: 145, awayMissed: 18 },
  scrums: { homeWon: 7, homeLost: 1, awayWon: 6, awayLost: 1 },
  lineouts: { homeWon: 13, homeLost: 1, awayWon: 11, awayLost: 2 },
  turnovers: { homeWon: 8, awayWon: 6 },
  penalties: { homeConceded: 8, awayConceded: 10 }
};
