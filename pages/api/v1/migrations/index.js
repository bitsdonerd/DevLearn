import { createRouter } from "next-connect";
import controller from "infra/controller";
import authMiddleware from "infra/auth_middleware";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const router = createRouter();

router.use(authMiddleware);
router.get(getMigrationsHandler);
router.post(postMigrationsHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationOptions = {
  dryRun: false,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getMigrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });
    response.status(200).json(pendingMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}

async function postMigrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    response.status(200).json(migratedMigrations);
  } finally {
    if (dbClient) await dbClient.end();
  }
}
