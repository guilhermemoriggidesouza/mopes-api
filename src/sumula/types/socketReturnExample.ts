
type period = {
    totalFaults: number
    totalPoints: number
}

type game = {
    id: number;
    championshipId: number;
    gameControls: [
        {
            id: number;
            sumulaId: number;
            teamId: number;
            playerId: number;
            point: number;
            fault: number;
            period: number
        }
    ];
    teams: [
        {
            name: string;
            points: number;
            faults: number;
            players: [
                {
                    playerId: number,
                    faults: number,
                    points: number
                }
            ]
        }
    ],
    periods: [
        {
            totalFaults: number
            totalPoints: number
        }
    ]

}