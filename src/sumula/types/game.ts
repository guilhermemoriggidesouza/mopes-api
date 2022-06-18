type team = {
    id: number;
    name: string;
    creatorId: number;
    coachId: number;
    capitanId: number;
    points: number;
    faults: number;
}

type gameControl = {
    id: number;
    sumulaId: number;
    teamId: number;
    playerId: number;
    point: number;
    fault: number;
    period: number
}

type championship = {
    id: number;
    name: string;
    logo: string;
    payedIntegration: boolean;
    categoryId: number;
}

type period = {
    totalFaults: number
    totalPoints: number
}

type game = {
    id: number;
    teams: team[];
    championship: championship;
    championshipId: number;
    gameControls: gameControl[];
    periods: period[]
}