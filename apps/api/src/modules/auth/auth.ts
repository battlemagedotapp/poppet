import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { jwt } from "better-auth/plugins"

import { authSchemaTables } from "../../db/schema/auth"
import { env } from "../../env"
import { createRedisSecondaryStorage, type AuthRedisClient } from "./storage"
import { AUTH_DEFAULT_ROLES, createUserRid, normalizeAuthRoles, toIsoString } from "./utils"

export type AuthRuntimeServices = {
	db: any
	redis: AuthRedisClient
}

export function createAuth(services: AuthRuntimeServices) {
	const baseURL = env.AUTH_BASE_URL.endsWith("/api/auth")
		? env.AUTH_BASE_URL
		: `${env.AUTH_BASE_URL.replace(/\/$/, "")}/api/auth`
	const usesHttpsAuth = new URL(baseURL).protocol === "https:"
	const allowsLocalhostWeb = env.AUTH_ALLOWED_ORIGINS.some((origin) => {
		try {
			const hostname = new URL(origin).hostname
			return hostname === "localhost" || hostname === "127.0.0.1"
		} catch {
			return false
		}
	})

	return betterAuth({
		advanced: {
			defaultCookieAttributes:
				usesHttpsAuth && allowsLocalhostWeb
					? {
							sameSite: "none",
							secure: true,
						}
					: undefined,
			ipAddress: {
				ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
			},
		},
		appName: "Poppet",
		baseURL,
		database: drizzleAdapter(services.db, { provider: "pg", schema: authSchemaTables }),
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false,
		},
		plugins: [
			jwt({
				jwks: {
					keyPairConfig: { alg: "RS256", modulusLength: 2048 },
				},
				jwt: {
					audience: env.AUTH_JWT_AUDIENCE,
					definePayload: ({ user }) => ({
						createdAt: toIsoString(user.createdAt),
						email: user.email,
						name: user.name,
						rid: user.rid,
						roles: normalizeAuthRoles(user.roles as string[]),
						updatedAt: toIsoString(user.updatedAt),
					}),
					expirationTime: "15m",
					getSubject: ({ user }) => user.id,
					issuer: baseURL,
				},
			}),
		],
		rateLimit: {
			customRules: {
				"/api/auth/get-session": { max: 300, window: 60 },
				"/api/auth/token": { max: 120, window: 60 },
				"/get-session": { max: 300, window: 60 },
				"/token": { max: 120, window: 60 },
			},
			enabled: true,
			max: 120,
			storage: "secondary-storage",
			window: 60,
		},
		secondaryStorage: createRedisSecondaryStorage(services.redis),
		secret: env.BETTER_AUTH_SECRET,
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5,
			},
			storeSessionInDatabase: true,
			updateAge: 60 * 15,
		},
		trustedOrigins: env.AUTH_ALLOWED_ORIGINS,
		user: {
			additionalFields: {
				rid: {
					defaultValue: createUserRid,
					input: false,
					required: true,
					type: "string",
				},
				roles: {
					defaultValue: () => [...AUTH_DEFAULT_ROLES],
					input: false,
					required: true,
					type: "string[]",
				},
			},
		},
	})
}

export type ApiAuth = ReturnType<typeof createAuth>
