import { createClient } from "redis"

import { db } from "../../db/client"
import { env } from "../../env"
import { createAuth, type ApiAuth } from "./auth"

export type AuthRuntime = {
	auth: ApiAuth
	redis: ReturnType<typeof createClient>
}

let runtimePromise: Promise<AuthRuntime> | null = null

export function getAuthRuntime() {
	runtimePromise ??= createAuthRuntime()
	return runtimePromise
}

async function createAuthRuntime(): Promise<AuthRuntime> {
	const redis = createClient({ url: env.VALKEY_URL })
	redis.on("error", (err) => console.error("Valkey client error:", err))
	await redis.connect()

	return {
		auth: createAuth({ db, redis }),
		redis,
	}
}
