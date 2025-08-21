import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "models/migrator";
import authMiddleware from "infra/auth_middleware";

const router = createRouter();

router.use(authMiddleware);
router.get(getMigrationsHandler);
router.post(postMigrationsHandler);

export default router.handler(controller.errorHandlers);

async function getMigrationsHandler(request, response) {
  const pendingMigrations = await migrator.listPendingMigrations();
  return response.status(200).json(pendingMigrations);
}

async function postMigrationsHandler(request, response) {
  const migratedMigrations = await migrator.runPendingMigrations();

  if (migratedMigrations.length > 0) {
    return response.status(201).json(migratedMigrations);
  }
  response.status(200).json(migratedMigrations);
}
