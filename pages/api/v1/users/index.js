import { createRouter } from "next-connect";
import controller from "infra/controller";

const router = createRouter();

router.post(postMigrationsHandler);

export default router.handler(controller.errorHandlers);

async function postMigrationsHandler(request, response) {
  response.status(201).json({});
}
