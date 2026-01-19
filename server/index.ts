import { existsSync } from "node:fs";
import app from "./api";
import { config, LOCAL_DB, VECTOR_DB } from "./config";
import { db } from "./db/connection";

// Check if Doclea databases exist
function checkDatabases(): { local: boolean; vector: boolean } {
  return {
    local: existsSync(LOCAL_DB),
    vector: existsSync(VECTOR_DB),
  };
}

const databases = checkDatabases();

if (!databases.local) {
  console.warn(`⚠️  Local database not found at: ${LOCAL_DB}`);
  console.warn(
    "   Run Doclea MCP tools to initialize the database, or set DOCLEA_PATH env var.",
  );
}

if (!databases.vector) {
  console.warn(`⚠️  Vector database not found at: ${VECTOR_DB}`);
  console.warn("   Semantic search will not work until vectors are created.");
}

// Verify database connections
try {
  if (databases.local) {
    db.getLocalDb();
    console.log("✓ Connected to local database");
  }
  if (databases.vector) {
    db.getVectorDb();
    console.log("✓ Connected to vector database");
  }
} catch (error) {
  console.error("Failed to connect to database:", error);
  process.exit(1);
}

// Start server
console.log(`
╔══════════════════════════════════════╗
║       Doclea Studio Backend          ║
╚══════════════════════════════════════╝

  Local DB:  ${databases.local ? "✓" : "✗"} ${LOCAL_DB}
  Vector DB: ${databases.vector ? "✓" : "✗"} ${VECTOR_DB}

  API: http://${config.host}:${config.port}/api/v1
`);

export default {
  port: config.port,
  hostname: config.host,
  fetch: app.fetch,
};

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down...");
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down...");
  db.close();
  process.exit(0);
});
