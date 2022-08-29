type periods = {
  faults: number;
  points: number;
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
  playerInMatchId: number;
  name: string;
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
  players: players[];
};
type gameStatus = {
  id: number;
  championshipId: number;
  teams: team[];
  periods: periods[];
};
