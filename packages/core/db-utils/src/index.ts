import pg from "pg"

export interface DbConfig {
	connectionString: string
	maxConnections?: number
}

export function createPgPool(config: DbConfig) {
	const pool = new pg.Pool({
		connectionString: config.connectionString,
		max: config.maxConnections ?? 10,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	})

	pool.on("error", (err) => {
		console.error("Unexpected database pool error:", err)
	})

	return pool
}

export async function ensureDatabaseExists(connectionString: string) {
	const targetUrl = new URL(connectionString)
	const databaseName = targetUrl.pathname.replace(/^\//, "")

	if (!databaseName) {
		throw new Error("Database connection string must include a database name.")
	}

	const adminUrl = new URL(targetUrl)
	adminUrl.pathname = "/postgres"

	const client = new pg.Client({
		connectionString: adminUrl.toString(),
		connectionTimeoutMillis: 2000,
	})

	await client.connect()
	try {
		const result = await client.query("select 1 from pg_database where datname = $1", [
			databaseName,
		])
		if ((result.rowCount ?? 0) > 0) return false

		await client.query(`create database ${quotePgIdentifier(databaseName)}`)
		return true
	} finally {
		await client.end()
	}
}

function quotePgIdentifier(identifier: string) {
	return `"${identifier.replaceAll('"', '""')}"`
}
