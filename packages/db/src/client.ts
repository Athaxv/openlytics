import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./db/schema";

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim() ?? "";
  return raw.replace(/^['"]|['"]$/g, "");
}

const sql = neon(getDatabaseUrl());
export const db = drizzle(sql, { schema });
