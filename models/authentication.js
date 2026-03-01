import user from "models/user.js";
import password from "models/password";
import { NotFoundError, UnauthorizedError } from "infra/errors.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findOneByEmail(providedEmail);
    await validatePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Incorrect authentication credentials",
        action: "Please check your input data and try again",
      });
    }
    throw error;
  }

  async function findOneByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Incorrect authentication credentials",
          action: "Please check your input data and try again",
        });
      }

      throw error;
    }
    return storedUser;
  }

  async function validatePassword(providedPassword, storedPassword) {
    const passwordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError({
        message: "Incorrect authentication credentials",
        action: "Please check your input data and try again",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
