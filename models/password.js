import bcryptjs from "bcryptjs";

const pepper = process.env.PASSWORD_PEPPER || "";

async function hash(password) {
  const rounds = getNumberofRounds();
  return await bcryptjs.hash(password + pepper, rounds);
}

function getNumberofRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(providedPassword, storedPassword) {
  return await bcryptjs.compare(providedPassword, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
