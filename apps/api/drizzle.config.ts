import { defineConfig } from "drizzle-kit"

export default defineConfig({
	dbCredentials: {
		url: requiredEnv("DATABASE_URL"),
	},
	dialect: "postgresql",
	out: "./migrations",
	schema: "./src/db/schema/index.ts",
})

function requiredEnv(key: string) {
	const value = process.env[key]?.trim()
	if (!value) throw new Error(`${key} must be set.`)
	return value
}
