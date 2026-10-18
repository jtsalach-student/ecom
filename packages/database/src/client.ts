import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/index.js";

export function getNeonSql(connectionString?: string): NeonQueryFunction<any, any> | null {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url || url.includes("postgres:postgres@localhost")) {
    return null;
  }
  try {
    return neon(url);
  } catch (err) {
    console.warn("Failed to initialize Neon SQL client:", err);
    return null;
  }
}

export function createDatabaseClient(connectionString?: string) {
  const url = connectionString || process.env.DATABASE_URL;
  if (!url || url.includes("postgres:postgres@localhost")) {
    return null;
  }
  try {
    const sql: NeonQueryFunction<any, any> = neon(url);
    return drizzle(sql, { schema });
  } catch (err) {
    console.warn("Failed to initialize Neon serverless database client, falling back:", err);
    return null;
  }
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;

