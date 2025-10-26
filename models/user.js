import database from "infra/database";
import { ValidationError } from "infra/errors.js";

async function create(userInputValues) {

  await validateUniqueEmail(userInputValues.email)

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
        SELECT
            email
        FROM 
            users 
        WHERE
            LOWER(email) = LOWER($1) 
        ;`,
      values: [
        email
      ],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "Email already in use",
        action: "Please change the email and try again",
      })
    };
  }

  async function runInsertQuery(userInputValues) {
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

    return results.rows[0];
  }
}

const user = {
  create,
};

export default user; 
