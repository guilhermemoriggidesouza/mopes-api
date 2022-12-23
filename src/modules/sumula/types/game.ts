type periods = {
  period: string;
  teams: team[];
};
type playersInMatch = {
  id: number;
  sumulaId: number;
  teamId: number;
  playerId: number;
  point: number;
  fault: number;
};
type players = {
  id: number;
  name: string;
  playerInMatchId?: number;
  infractions?: number;
  userId?: number;
  teamId?: number;
  points: number;
  faults: number;
};
type team = {
  name: string;
  points: number;
  faults: number;
};
type gameStatus = {
  id: number;
  championshipId: number;
  teams: team[];
  players: players[];
  periods: periods[];
};
