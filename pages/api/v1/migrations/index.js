import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database";

const migrations = async (request, response) => {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allowed`,
    });
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationsOpitions = {
      dbClient: dbClient,
      dryRun: true,
      dir: join("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner(
        defaultMigrationsOpitions,
      );
      response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOpitions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        response.status(201).json(migratedMigrations);
      }
      response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
};

export default migrations;
