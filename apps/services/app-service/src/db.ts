import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

import { env } from "./env"
import * as schema from "./schema"

const pool = new pg.Pool({
	connectionString: env.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
})

pool.on("error", (err) => {
	console.error("Unexpected database pool error:", err)
})

export const db = drizzle(pool, { schema })
export { pool }
