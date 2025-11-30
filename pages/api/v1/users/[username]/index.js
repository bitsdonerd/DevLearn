import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

router.get(getMigrationsHandler);

export default router.handler(controller.errorHandlers);

async function getMigrationsHandler(request, response) {
  // api/v1/users/[username]
  const username = request.query.username;
  const userFound = await user.findOneByUsername(username);

  return response.status(200).json(userFound);
}
