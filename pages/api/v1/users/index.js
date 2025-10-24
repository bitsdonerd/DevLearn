import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user.js";

const router = createRouter();

router.post(postMigrationsHandler);

export default router.handler(controller.errorHandlers);

async function postMigrationsHandler(request, response) {
  // Importante entender como os dados de uma request entram aqui no controller 
  // -- como quando alguem realizar um post contra esse endpoint (username, email, password)
  const userInputValues = request.body;

  // Aqui deve ser a logica de criacao do usuario dentro do model 
  const newUser = await user.create(userInputValues);

  // O model deve retornar o usuario criado no Banco de Dados e 
  // tambem retornar o registro aqui no controller para permitir a resposta no endpoint 
  return response.status(201).json(newUser); // Retorna o registro do usuario criado no endpoint 
}
