const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\n 🟢 PostgreSQL is ready and accepting connections! \n");
  }
}

process.stdout.write(
  "\n\n 🔴 Waiting for PostgreSQL connections to be ready \n\n",
);
checkPostgres();

class LoadingSpinner {
  constructor(
    message = "Waiting for PostgreSQL connections to be ready",
    intervalTime = 100,
  ) {
    this.message = message;
    this.intervalTime = intervalTime;
    this.loadingIndicator = 0;
    this.loadingFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => {
      const frame =
        this.loadingFrames[this.loadingIndicator++ % this.loadingFrames.length];
      process.stdout.write(`\r\x1b[33m${frame} ${this.message}\x1b[0m `);
    }, this.intervalTime);
  }

  stop() {
    clearInterval(this.interval);
    process.stdout.write("\r\x1b[32m✔ PostgreSQL is ready!\x1b[0m\n");
  }
}
