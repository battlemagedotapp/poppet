import { inferAdditionalFields, jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import { useMemo } from "react"

const getApiUrl = () => {
	const viteApiUrl =
		typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.VITE_API_URL : undefined

	// Fallback to localhost for development; production URLs must be injected at build time
	const base = viteApiUrl || "http://localhost:6201"
	return base.endsWith("/api/auth") ? base : `${base.replace(/\/$/, "")}/api/auth`
}

const apiUrl = getApiUrl()

export const authClient = createAuthClient({
	baseURL: apiUrl,
	fetchOptions: {
		credentials: "include",
	},
	plugins: [
		inferAdditionalFields({
			user: {
				rid: {
					type: "string",
					required: true,
					input: false,
				},
				roles: {
					type: "string[]",
					required: true,
					input: false,
				},
			},
		}),
		jwtClient(),
	],
	sessionOptions: {
		refetchOnWindowFocus: false,
		refetchWhenOffline: false,
	},
})

export type AuthRole = "admin" | "user"

export type AuthUser = {
	createdAt: string
	email: string
	rid: string
	name: string
	roles: AuthRole[]
	updatedAt: string
}

export type AuthProfileUpdate = {
	currentPassword: string
	email: string
	name: string
	newPassword: string
}

export type AppSessionStatus = "anonymous" | "authenticated" | "loading"

export type AuthRouterState = {
	isPending: boolean
	user: AuthUser | null
}

export type AppSessionState = AuthRouterState & {
	status: AppSessionStatus
}

export function normalizeAuthRoles(roles: string[] | null | undefined): AuthRole[] {
	const validRoles = new Set<AuthRole>(["admin", "user"])
	const normalized = (roles ?? []).filter((role): role is AuthRole =>
		validRoles.has(role as AuthRole)
	)
	return normalized.length > 0 ? normalized : ["user"]
}

export function getAuthErrorMessage(error: { message?: string }) {
	return error.message || "Authentication failed."
}

export function useAuthSession(): AppSessionState {
	const session = authClient.useSession()

	const user = useMemo(() => {
		if (session.isPending || !session.data?.user) return null

		const sessionUser = session.data.user
		return {
			createdAt: sessionUser.createdAt
				? new Date(sessionUser.createdAt).toISOString()
				: new Date(0).toISOString(),
			email: sessionUser.email.trim().toLowerCase(),
			rid: sessionUser.rid,
			name: sessionUser.name,
			roles: normalizeAuthRoles(sessionUser.roles),
			updatedAt: sessionUser.updatedAt
				? new Date(sessionUser.updatedAt).toISOString()
				: new Date(0).toISOString(),
		}
	}, [session.data?.user, session.isPending])

	const status = useMemo(() => {
		if (session.isPending) return "loading"
		return user ? "authenticated" : "anonymous"
	}, [session.isPending, user])

	return useMemo(
		() => ({
			isPending: session.isPending,
			status,
			user,
		}),
		[session.isPending, status, user]
	)
}

type TokenCacheOptions = {
	load: () => Promise<string | null>
	expiresSkewMs?: number
}

export function createTokenCache({ load, expiresSkewMs = 30_000 }: TokenCacheOptions) {
	let cachedToken: string | null = null
	let cachedExp: number | null = null
	let activeLoadPromise: Promise<string | null> | null = null

	function decodeJwtExp(token: string): number | null {
		try {
			const parts = token.split(".")
			if (parts.length !== 3) return null
			const payload = parts[1]
			const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
			if (typeof globalThis.atob !== "function") return null
			const padding = (4 - (base64.length % 4)) % 4
			const decoded = globalThis.atob(base64.padEnd(base64.length + padding, "="))
			const parsed = JSON.parse(decoded)
			return typeof parsed.exp === "number" ? parsed.exp * 1000 : null
		} catch {
			return null
		}
	}

	return {
		async get(): Promise<string | null> {
			const now = Date.now()
			if (cachedToken && cachedExp && now < cachedExp - expiresSkewMs) {
				return cachedToken
			}

			if (activeLoadPromise) {
				return activeLoadPromise
			}

			activeLoadPromise = (async () => {
				try {
					const token = await load()
					if (token) {
						cachedToken = token
						cachedExp = decodeJwtExp(token)
					} else {
						cachedToken = null
						cachedExp = null
					}
					return cachedToken
				} catch (error) {
					cachedToken = null
					cachedExp = null
					throw error
				} finally {
					activeLoadPromise = null
				}
			})()

			return activeLoadPromise
		},
		clear() {
			cachedToken = null
			cachedExp = null
			activeLoadPromise = null
		},
	}
}

const tokenCache = createTokenCache({
	load: async () => {
		const result = await authClient.token()
		return result.data?.token ?? null
	},
	expiresSkewMs: 30_000,
})

export async function fetchAuthAccessToken() {
	return tokenCache.get()
}

const signOutCallbacks = new Set<() => void>()

export function registerSignOutCallback(callback: () => void) {
	signOutCallbacks.add(callback)
	return () => {
		signOutCallbacks.delete(callback)
	}
}

export function clearAuthAccessTokenCache() {
	tokenCache.clear()
}

export function notifyAuthSignOut() {
	tokenCache.clear()
	for (const cb of signOutCallbacks) {
		try {
			cb()
		} catch (e) {
			console.error("Sign-out callback failed:", e)
		}
	}
}
