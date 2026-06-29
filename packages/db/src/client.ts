import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";

type Db = NeonHttpDatabase<typeof schema>;

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  return raw.replace(/^['"]|['"]$/g, "");
}

let dbInstance: Db | undefined;

function getDb(): Db {
  if (!dbInstance) {
    const url = getDatabaseUrl();
    if (!url) {
      throw new Error("DATABASE_URL is not set");
    }
    dbInstance = drizzle(neon(url), { schema });
  }
  return dbInstance;
}

/** Lazy proxy so Next.js build can import auth/db modules without a live connection. */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getDb(), prop, receiver);
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});
