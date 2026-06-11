import type { AuthRole } from "@strawdev/contracts/auth"

import { createRid } from "../rids"

export const AUTH_USER_RID_PREFIX = "user"
export const AUTH_DEFAULT_ROLES = ["user"] as const

export function createUserRid() {
	return createRid(AUTH_USER_RID_PREFIX)
}

export function normalizeAuthRoles(roles: AuthRole[] | string[] | null | undefined): AuthRole[] {
	const validRoles = new Set<AuthRole>(["admin", "user"])
	const normalized = (roles ?? []).filter((role): role is AuthRole =>
		validRoles.has(role as AuthRole)
	)

	return normalized.length > 0 ? normalized : [...AUTH_DEFAULT_ROLES]
}

export function toIsoString(value: Date | number | string) {
	if (value instanceof Date) return value.toISOString()
	if (typeof value === "number") return new Date(value).toISOString()
	return new Date(value).toISOString()
}
