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
