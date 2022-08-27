type periodInfos = {
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

type team = {
  name: string;
  points: number;
  faults: number;
};
type gameStatus = {
  id: number;
  championshipId: number;
  playersInMatch: playersInMatch[];
  teams: team[];
  periods: periodInfos[];
};
