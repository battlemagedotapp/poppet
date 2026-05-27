import { z } from "zod"

const envSchema = z.object({
	DATABASE_URL: z.string().url().default("postgres://postgres:password@localhost:54321/poppet_app"),
	PORT: z.coerce.number().default(8080),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
})

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error("❌ Invalid environment configuration:", result.error.format())
	process.exit(1)
}

export const env = result.data
