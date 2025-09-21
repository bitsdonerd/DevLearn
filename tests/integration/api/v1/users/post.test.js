import orchestrator from "tests/orchestrator.js";
import database from "infra/database.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      await database.query({
        text: "INSERT INTO users (username, email, password) VALUES ($1, $2, $3);",
        values: ["bitsdonerd", "bitsdonerd@gmail.com", "senha123"],
      });

      const users = await database.query("SELECT * FROM users;");
      console.log(users.rows);

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: 'f2b4dd86-fdbe-4ca0-9c67-d8ad19b281fa',
        username: 'bitsdonerd',
        email: 'bitsdonerd@gmail.com',
        password: 'senha123',
        created_at: '2025-09-14T19:37:24.693Z',
        updated_at: '2025-09-14T19:37:24.693Z'
      });
    });
  });
});
