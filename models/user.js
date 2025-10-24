import database from "infra/database";

async function create(userInputValues) {
  // Query de insert movida para o model de usuario - agora o model é responsavel por criar o usuario no banco de dados
  // Inserido o RETURNING * para retornar o registro inserido
  const results = await database.query({
    text: `
        INSERT INTO 
            users (username, email, password) 
        VALUES 
            ($1, $2, $3)
        RETURNING * 
        ;`,
    values: [
      userInputValues.username,
      userInputValues.email,
      userInputValues.password,
    ],
  });

  return results.rows[0]; // Retorna o array de linhas inseridas no banco de dados
}

const user = {
  create, // retorna um objeto com os dados do usuario criado
};

export default user; // exporta o model de usuario com a funcao de criacao
