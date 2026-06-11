import { randomUUID } from "node:crypto"

import { db, type ApiDb } from "../../db/client"
import { env } from "../../env"
import { resolveAuthContext } from "../../modules/auth/session"
import { ApiHttpError } from "./errors"

export async function createApiRequestContext(request: Request) {
	return {
		auth: await resolveAuthContext(request.headers),
		db,
		env,
		raw: {
			headers: request.headers,
			signal: request.signal,
		},
		requestId: randomUUID(),
	}
}

export type ApiRequestContext = Omit<Awaited<ReturnType<typeof createApiRequestContext>>, "db"> & {
	db: ApiDb
}

export function requireApiAuth(ctx: ApiRequestContext) {
	if (!ctx.auth) {
		throw new ApiHttpError(401, "unauthorized", "Authentication is required.")
	}

	return ctx.auth
}
