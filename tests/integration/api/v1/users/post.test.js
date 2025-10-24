import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {

      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        // Especifique que o corpo da requisição(tipo dos dados) é JSON
        headers: {
          "Content-Type": "application/json",
        },
        // Metodo para converter um objeto JavaScript em uma string JSON
        body: JSON.stringify({
          username: "bitsdonerd",
          email: "bitsdonerd@gmail.com",
          password: "senha123",
        })
      });

      // Verifica os usuarios no banco apos a criacao
      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'bitsdonerd',
        email: 'bitsdonerd@gmail.com',
        password: 'senha123',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at, // tunelamento da resposta para ser ela mesma 
      });

      expect(uuidVersion(responseBody.id)).toBe(4); // Verifica se o ID é um UUID v4
      expect(Date.parse(responseBody.created_at)).not.toBeNaN(); // Verifica se created_at é uma data válida
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

    });
  });
});
