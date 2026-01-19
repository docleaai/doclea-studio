import Database from "libsql";
import { LOCAL_DB, VECTOR_DB } from "../config";

type DatabaseInstance = InstanceType<typeof Database>;

let localDb: DatabaseInstance | null = null;
let vectorDb: DatabaseInstance | null = null;

export class DatabaseManager {
  private static instance: DatabaseManager | null = null;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  getLocalDb(): DatabaseInstance {
    if (!localDb) {
      localDb = new Database(LOCAL_DB);
      localDb.exec("PRAGMA journal_mode = WAL;");
      localDb.exec("PRAGMA busy_timeout = 5000;");
      localDb.exec("PRAGMA foreign_keys = ON;");
    }
    return localDb;
  }

  getVectorDb(): DatabaseInstance {
    if (!vectorDb) {
      vectorDb = new Database(VECTOR_DB);
      vectorDb.exec("PRAGMA journal_mode = WAL;");
      vectorDb.exec("PRAGMA busy_timeout = 5000;");
    }
    return vectorDb;
  }

	close(): void {
		if (localDb) {
			localDb.close();
			localDb = null;
		}
		if (vectorDb) {
			vectorDb.close();
			vectorDb = null;
		}
	}
}

export async function withRetry<T>(
	operation: () => T,
	maxRetries = 3,
): Promise<T> {
	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			return operation();
		} catch (error) {
			const sqliteError = error as { code?: string };
			if (sqliteError.code === "SQLITE_BUSY" && attempt < maxRetries - 1) {
				await new Promise((r) => setTimeout(r, 2 ** attempt * 100));
				continue;
			}
			throw error;
		}
	}
	throw new Error("withRetry: max retries exceeded");
}

export const db = DatabaseManager.getInstance();
