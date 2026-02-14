#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

const migrationsDir = path.join(__dirname, "migrations");

async function ensureMigrationsTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(255) PRIMARY KEY,
      name TEXT NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function getMigrationFiles() {
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }

  return fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

function parseMigrationMeta(fileName) {
  const firstUnderscoreIndex = fileName.indexOf("_");
  const version =
    firstUnderscoreIndex === -1
      ? fileName.replace(".sql", "")
      : fileName.slice(0, firstUnderscoreIndex);

  return {
    version,
    name: fileName
  };
}

async function runMigrations() {
  const client = new Client({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "demo_db",
    password: process.env.DB_PASSWORD || "postgres",
    port: Number(process.env.DB_PORT) || 5432
  });

  try {
    await client.connect();
    await ensureMigrationsTable(client);

    const migrationFiles = getMigrationFiles();
    if (migrationFiles.length === 0) {
      console.log("No migration files found.");
      return;
    }

    const appliedResult = await client.query(
      "SELECT version FROM schema_migrations"
    );
    const appliedVersions = new Set(appliedResult.rows.map((row) => row.version));

    for (const fileName of migrationFiles) {
      const { version, name } = parseMigrationMeta(fileName);

      if (appliedVersions.has(version)) {
        console.log(`Skipping ${fileName} (already applied)`);
        continue;
      }

      const fullPath = path.join(migrationsDir, fileName);
      const sql = fs.readFileSync(fullPath, "utf8");

      console.log(`Applying ${fileName}...`);
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (version, name) VALUES ($1, $2)",
        [version, name]
      );
      await client.query("COMMIT");
      console.log(`Applied ${fileName}`);
    }

    console.log("Migration run completed.");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (_rollbackError) {
      // no-op
    }
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

runMigrations();
