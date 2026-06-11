import { authRoleSchema } from "@strawdev/contracts/auth"
import { z } from "zod"

import type { ApiAuthContext } from "../../context"
import { env } from "../../env"
import { getAuthRuntime } from "./runtime"

const authClaimsSchema = z.object({
	email: z.string().email(),
	name: z.string().min(1),
	rid: z.string().min(1),
	roles: z.array(authRoleSchema).default(["user"]),
})

const sessionResultSchema = z
	.object({
		user: authClaimsSchema,
	})
	.nullable()

const verifyJwtResultSchema = z.object({
	payload: authClaimsSchema
		.extend({
			aud: z.string(),
			exp: z.number().int().optional(),
			iat: z.number().int().optional(),
			sub: z.string(),
		})
		.nullable(),
})

export async function resolveAuthContext(headers: Headers): Promise<ApiAuthContext | null> {
	const token = getBearerToken(headers.get("authorization"))
	if (token) return await resolveBearerToken(token)
	if (!headers.get("cookie")) return null
	return await resolveSessionCookie(headers)
}

function getBearerToken(authorization: null | string) {
	const [scheme, token] = authorization?.split(/\s+/, 2) ?? []
	if (scheme?.toLowerCase() !== "bearer" || !token) return null
	return token
}

async function resolveBearerToken(token: string): Promise<ApiAuthContext | null> {
	const { auth } = await getAuthRuntime()
	const result = await auth.api
		.verifyJWT({
			body: {
				issuer: getAuthIssuer(),
				token,
			},
		})
		.catch(() => null)
	const parsed = verifyJwtResultSchema.safeParse(result)
	if (!parsed.success || !parsed.data.payload) return null
	return toAuthContext(parsed.data.payload)
}

async function resolveSessionCookie(headers: Headers): Promise<ApiAuthContext | null> {
	const { auth } = await getAuthRuntime()
	const result = await auth.api.getSession({ headers }).catch(() => null)
	const parsed = sessionResultSchema.safeParse(result)
	if (!parsed.success || !parsed.data) return null
	return toAuthContext(parsed.data.user)
}

function getAuthIssuer() {
	return env.AUTH_BASE_URL.endsWith("/api/auth")
		? env.AUTH_BASE_URL
		: `${env.AUTH_BASE_URL.replace(/\/$/, "")}/api/auth`
}

function toAuthContext(user: z.infer<typeof authClaimsSchema>): ApiAuthContext {
	return {
		userEmail: user.email,
		userName: user.name,
		userPrincipalRef: `user:${user.rid}`,
		userRid: user.rid,
		userRoles: user.roles,
	}
}
