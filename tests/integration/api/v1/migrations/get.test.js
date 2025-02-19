import database from "infra/database";



test("GET to /api/v1/migrations should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  console.log(responseBody);

  // Array of migrations
  expect(Array.isArray(responseBody)).toEqual(true);
  // Check if the first migration has content
  expect(responseBody.length).toBeGreaterThan(0);
});