import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator.js";
import session from "models/session";
import setCookieParser from "set-cookie-parser";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/user", () => {
  describe("Default user", () => {
    test("With valid session", async () => {
      const createdUser = await orchestrator.createUser({
        username: "UserWithValidSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        }
      }
      );
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: createdUser.id,
        username: "UserWithValidSession",
        email: createdUser.email,
        password: createdUser.password,
        created_at: createdUser.created_at.toISOString(),
        updated_at: createdUser.updated_at.toISOString(),
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      // Session renewal assertions
      const renewedSessionObject = await session.findOneValidByToken(sessionObject.token);
      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toEqual(true);
      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toEqual(true);

      // Set-Cookie header assertions
      const parsedSetCookie = setCookieParser(response, {
        map: true,
      });
      expect(parsedSetCookie.session_id).toEqual({
        name: "session_id",
        value: sessionObject.token,
        maxAge: session.EXPIRES_IN_MILLISECONDS / 1000,
        path: "/",
        httpOnly: true,
      });
    });

    test("With nonexistent session", async () => {
      const nonexistentToken = "020cce6fb9e134a2380ed733d99caf0c75def8f13460547e7014a196b5dcdb1d6db5be5361f85df4d54dc230bf2f444b"

      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${nonexistentToken}`,
        }
      });
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "User session not found or has expired.",
        action: "Please log in again to obtain a valid session.",
        status_code: 401,
      });
    });

    test("With expired session", async () => {
      jest.useFakeTimers({
        now: new Date(Date.now() - session.EXPIRES_IN_MILLISECONDS),
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);
      // Restore real timers to allow the session expiration logic to work correctly during the API request
      jest.useRealTimers();

      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        }
      }
      );
      expect(response.status).toBe(401);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "UnauthorizedError",
        message: "User session not found or has expired.",
        action: "Please log in again to obtain a valid session.",
        status_code: 401,
      });
    });

    test("With session past half of valid time", async () => {
      const halfLifeTime = Date.now() - session.EXPIRES_IN_MILLISECONDS / 2;

      jest.useFakeTimers({
        now: new Date(halfLifeTime),
      });

      const createdUser = await orchestrator.createUser({
        username: "UserWithHalfExpiredSession",
      });

      const sessionObject = await orchestrator.createSession(createdUser.id);

      jest.useRealTimers();

      const response = await fetch(
        "http://localhost:3000/api/v1/user", {
        headers: {
          Cookie: `session_id=${sessionObject.token}`,
        }
      }
      );
      expect(response.status).toBe(200);

      const renewedSessionObject = await session.findOneValidByToken(sessionObject.token);
      expect(renewedSessionObject.expires_at > sessionObject.expires_at).toBe(true);
      expect(renewedSessionObject.updated_at > sessionObject.updated_at).toBe(true);
    });
  });
});
