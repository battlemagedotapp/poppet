import { z } from "zod"

const requiredString = z.string().trim().min(1)
const requiredUrl = requiredString.pipe(z.string().url())

const commaSeparatedUrlList = z
	.string()
	.transform((value) =>
		value
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item.length > 0)
	)
	.pipe(z.array(z.string().url()).min(1))

const envSchema = z
	.object({
		API_ALLOWED_ORIGINS: commaSeparatedUrlList,
		API_PORT: z.coerce.number().int().min(1).max(65535),
		AUTH_ALLOWED_ORIGINS: commaSeparatedUrlList,
		AUTH_BASE_URL: requiredUrl,
		AUTH_JWT_AUDIENCE: requiredString,
		BETTER_AUTH_SECRET: requiredString,
		DATABASE_URL: requiredUrl,
		ELECTRIC_SECRET: requiredString,
		ELECTRIC_URL: requiredUrl,
		NODE_ENV: z.enum(["development", "production", "test"]),
		POPPET_ENV: z.enum(["local", "dev", "prod"]),
		VALKEY_URL: requiredUrl,
	})
	.superRefine((value, ctx) => {
		const expectedAudience = `poppet-${value.POPPET_ENV}`
		if (value.AUTH_JWT_AUDIENCE !== expectedAudience) {
			ctx.addIssue({
				code: "custom",
				message: `AUTH_JWT_AUDIENCE must be ${expectedAudience}`,
				path: ["AUTH_JWT_AUDIENCE"],
			})
		}
	})

const result = envSchema.safeParse(process.env)

if (!result.success) {
	console.error("Invalid API environment configuration:", result.error.format())
	process.exit(1)
}

const env = result.data

export { env }
