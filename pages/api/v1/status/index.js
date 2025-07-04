import database from "infra/database";

async function status(request, response) {
  // Data - toISOString
  const updatedAt = new Date().toISOString();

  // Postgres version
  const result = await database.query("SHOW server_version;");
  const postgresVersion = result.rows[0].server_version;
  console.log("Postgres version:", postgresVersion);

  // Postgres max conections
  const connection = await database.query("SHOW max_connections;");
  const postgresConnection = connection.rows[0].max_connections;
  console.log("Max connections:", postgresConnection);

  // Postgres open connections
  const databaseName = process.env.POSTGRES_DB;
  // "SELECT count(*) FROM pg_stat_activity;" - to get the number of open connections
  const usedConnection = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnections = usedConnection.rows[0].count;
  console.log("Opened connections:", databaseOpenedConnections);

  // API Rest - updated_at (snake_case)
  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: parseInt(postgresConnection),
        opened_connections: databaseOpenedConnections,
      },
    },
  });
}

export default status;
