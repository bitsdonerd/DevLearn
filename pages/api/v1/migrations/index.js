import { createRouter } from "next-connect";
import {
  InternalServerError,
  MethodNotAllowedError,
  ForbiddenError,
} from "infra/errors";
import authMiddleware from "infra/auth_middleware";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const router = createRouter();

router.use(authMiddleware);
router.get(getMigrationsHandler);
router.post(postMigrationsHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

function onNoMatchHandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  if (
    error instanceof MethodNotAllowedError ||
    error instanceof ForbiddenError
  ) {
    return response.status(error.statusCode).json(error);
  }

  const publicErrorObject = new InternalServerError({
    cause: error,
  });

  console.error("Erro capturado pelo onError do next-connect:", error);
  console.error(publicErrorObject);

  response.status(500).json(publicErrorObject);
}

async function getMigrationsHandler(request, response) {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      dbClient: dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
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
      dbClient: dbClient,
      dryRun: false,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    });

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    response.status(200).json(migratedMigrations);
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    if (dbClient) await dbClient.end();
  }
}
