import { migrate } from "drizzle-orm/node-postgres/migrator"

import { db, pool } from "./db"

console.log("Running Drizzle migrations...")

try {
	await migrate(db, { migrationsFolder: "./migrations" })
	console.log("Migrations successfully completed!")
} catch (err) {
	console.error("Migration failed:", err)
	process.exit(1)
} finally {
	await pool.end()
}
