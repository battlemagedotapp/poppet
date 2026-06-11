import { createPgPool } from "@strawdev/db-utils"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

import { env } from "../env"
import { apiSchemaTables } from "./schema"

export * from "./schema"

const pool = createPgPool({
	connectionString: env.DATABASE_URL,
	maxConnections: 10,
}) as pg.Pool

const db = drizzle(pool, { schema: apiSchemaTables })

export { db, pool }
export type ApiRootDb = typeof db
export type ApiTransaction = Parameters<Parameters<ApiRootDb["transaction"]>[0]>[0]
export type ApiDb = ApiRootDb | ApiTransaction
