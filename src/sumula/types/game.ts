type periodInfos = {
    faults: number
    points: number
}
type PlayerInMatch = {
    id: number;
    sumulaId: number;
    teamId: number;
    playerId: number;
    point: number;
    fault: number;
}

type team = {
    name: string;
    points: number;
    faults: number;
}
type gameStatus = {
    id: number;
    championshipId: number;
    playerInMatchs: PlayerInMatch[];
    teams: team[],
    periods: periodInfos[]
}