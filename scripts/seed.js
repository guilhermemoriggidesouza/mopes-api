/* eslint-disable */
/**
 * Seed manual: conecta no banco e cadastra apenas `category_game` e `championship`.
 *
 * Uso: npm run seed
 * Requer a variável DATABASE_URL no .env (ex: postgres://root:root@localhost:5432/mope)
 */
require('dotenv').config();
const { Client } = require('pg');

// ---------------------------------------------------------------------------
// Dados para cadastrar (edite manualmente aqui)
// ---------------------------------------------------------------------------
const categories = [
  {
    name: 'Sub-13 Masculino',
    maxPoints: 50,
    maxPeriod: 4,
    maxPlayersPerGame: 5,
    maxFaultsPerPlayer: 5,
    maxFaultsPerTeam: 5,
    maxInfractionPerPlayer: 2,
  },
  {
    name: 'Sub-15 Masculino',
    maxPoints: 60,
    maxPeriod: 4,
    maxPlayersPerGame: 5,
    maxFaultsPerPlayer: 5,
    maxFaultsPerTeam: 5,
    maxInfractionPerPlayer: 2,
  },
  {
    name: 'Adulto Masculino',
    maxPoints: 80,
    maxPeriod: 4,
    maxPlayersPerGame: 5,
    maxFaultsPerPlayer: 5,
    maxFaultsPerTeam: 5,
    maxInfractionPerPlayer: 2,
  },
];

// Cada championship referencia uma category pelo `name` acima.
const championships = [
  {
    name: 'Copa Mopes 2026',
    categoryName: 'Adulto Masculino',
    gamePerKeys: 1,
    payedIntegration: false,
    started: false,
  },
  {
    name: 'Torneio de Base 2026',
    categoryName: 'Sub-15 Masculino',
    gamePerKeys: 1,
    payedIntegration: false,
    started: false,
  },
];

// ---------------------------------------------------------------------------

async function upsertCategory(client, category) {
  const existing = await client.query(
    'SELECT id FROM category_game WHERE name = $1 LIMIT 1',
    [category.name],
  );
  if (existing.rows.length > 0) {
    console.log(`  category "${category.name}" já existe (id ${existing.rows[0].id})`);
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `INSERT INTO category_game
       ("name", "maxPoints", "maxPeriod", "maxPlayersPerGame",
        "maxFaultsPerPlayer", "maxFaultsPerTeam", "maxInfractionPerPlayer")
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id`,
    [
      category.name,
      category.maxPoints,
      category.maxPeriod,
      category.maxPlayersPerGame,
      category.maxFaultsPerPlayer,
      category.maxFaultsPerTeam,
      category.maxInfractionPerPlayer,
    ],
  );
  console.log(`  category "${category.name}" criada (id ${inserted.rows[0].id})`);
  return inserted.rows[0].id;
}

async function upsertChampionship(client, championship, categoryId) {
  const existing = await client.query(
    'SELECT id FROM championship WHERE name = $1 LIMIT 1',
    [championship.name],
  );
  if (existing.rows.length > 0) {
    console.log(
      `  championship "${championship.name}" já existe (id ${existing.rows[0].id})`,
    );
    return existing.rows[0].id;
  }

  const inserted = await client.query(
    `INSERT INTO championship
       ("name", "categoryId", "gamePerKeys", "payedIntegration", "started")
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [
      championship.name,
      categoryId,
      championship.gamePerKeys,
      championship.payedIntegration,
      championship.started,
    ],
  );
  console.log(
    `  championship "${championship.name}" criada (id ${inserted.rows[0].id})`,
  );
  return inserted.rows[0].id;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL não definida no ambiente/.env');
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log('Conectado ao banco.');

  try {
    await client.query('BEGIN');

    console.log('Cadastrando categories...');
    const categoryIdByName = {};
    for (const category of categories) {
      categoryIdByName[category.name] = await upsertCategory(client, category);
    }

    console.log('Cadastrando championships...');
    for (const championship of championships) {
      const categoryId = categoryIdByName[championship.categoryName];
      if (!categoryId) {
        throw new Error(
          `Category "${championship.categoryName}" não encontrada para o championship "${championship.name}"`,
        );
      }
      await upsertChampionship(client, championship, categoryId);
    }

    await client.query('COMMIT');
    console.log('Seed finalizada com sucesso.');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('Erro ao rodar a seed:', err.message);
  process.exit(1);
});
