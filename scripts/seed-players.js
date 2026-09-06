/* eslint-disable */
/**
 * Seed manual: garante pelo menos N jogadores em cada team existente.
 *
 * Para cada jogador criado, cria tambem um `user` (o app faz INNER JOIN em user
 * ao montar o status do jogo) e liga o jogador ao time nas duas tabelas de
 * juncao usadas pelo projeto (player_teams_team / team_players_player).
 *
 * Uso: npm run seed:players
 * Requer DATABASE_URL no .env.
 */
require('dotenv').config();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

// ---------------------------------------------------------------------------
const MIN_PLAYERS_PER_TEAM = 2;
const DEFAULT_PASSWORD = '123456';

const FIRST_NAMES = [
  'Lucas', 'Gabriel', 'Matheus', 'Rafael', 'Bruno', 'Felipe', 'Thiago',
  'Gustavo', 'Vinicius', 'Rodrigo', 'Diego', 'Andre', 'Caio', 'Pedro',
  'Joao', 'Marcelo', 'Leonardo', 'Eduardo', 'Fernando', 'Igor',
];
const LAST_NAMES = [
  'Silva', 'Souza', 'Oliveira', 'Santos', 'Pereira', 'Lima', 'Costa',
  'Almeida', 'Ferreira', 'Rodrigues', 'Gomes', 'Martins', 'Araujo',
  'Barbosa', 'Ribeiro', 'Carvalho', 'Nunes', 'Moraes', 'Cardoso', 'Teixeira',
];

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomName() {
  return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
}

// ---------------------------------------------------------------------------

async function countTeamPlayers(client, teamId) {
  const res = await client.query(
    'SELECT COUNT(*)::int AS n FROM player_teams_team WHERE "teamId" = $1',
    [teamId],
  );
  return res.rows[0].n;
}

async function createPlayerForTeam(client, team, index, passwordHash) {
  const name = randomName();
  const tag = `${team.id}-${Date.now().toString(36)}-${index}`;
  const login = `seed_player_${tag}`;
  const email = `seed_player_${tag}@mopes.local`;

  const userRes = await client.query(
    `INSERT INTO "user" ("name", "login", "email", "rg", "password", "role")
     VALUES ($1, $2, $3, '', $4, 'player')
     RETURNING id`,
    [name, login, email, passwordHash],
  );
  const userId = userRes.rows[0].id;

  const playerRes = await client.query(
    `INSERT INTO player ("name", "userId") VALUES ($1, $2) RETURNING id`,
    [name, userId],
  );
  const playerId = playerRes.rows[0].id;

  await client.query(
    `INSERT INTO player_teams_team ("playerId", "teamId") VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [playerId, team.id],
  );
  await client.query(
    `INSERT INTO team_players_player ("teamId", "playerId") VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [team.id, playerId],
  );

  return { playerId, userId, name };
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não definida no ambiente/.env');
  }

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, await bcrypt.genSalt());

  const client = new Client({ connectionString });
  await client.connect();
  console.log('Conectado ao banco.');

  try {
    await client.query('BEGIN');

    const teams = await client.query('SELECT id, name FROM team ORDER BY id');
    if (teams.rows.length === 0) {
      console.log('Nenhum team no banco. Nada a fazer.');
      await client.query('COMMIT');
      return;
    }

    let createdTotal = 0;
    for (const team of teams.rows) {
      const current = await countTeamPlayers(client, team.id);
      const missing = Math.max(0, MIN_PLAYERS_PER_TEAM - current);

      if (missing === 0) {
        console.log(
          `team ${team.id} "${team.name}": já tem ${current} jogador(es), ok`,
        );
        continue;
      }

      console.log(
        `team ${team.id} "${team.name}": ${current} jogador(es), criando ${missing}...`,
      );
      for (let i = 0; i < missing; i++) {
        const p = await createPlayerForTeam(client, team, i, passwordHash);
        console.log(`  + player ${p.playerId} (${p.name}) / user ${p.userId}`);
        createdTotal++;
      }
    }

    await client.query('COMMIT');
    console.log(`Seed finalizada. ${createdTotal} jogador(es) criado(s).`);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Erro ao rodar a seed de jogadores:', err.message);
  process.exit(1);
});
