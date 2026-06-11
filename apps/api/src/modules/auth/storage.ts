export type AuthRedisClient = {
	del: (key: string) => Promise<unknown>
	get: (key: string) => Promise<string | null>
	set: (key: string, value: string) => Promise<unknown>
	setEx: (key: string, ttlSeconds: number, value: string) => Promise<unknown>
}

export function createRedisSecondaryStorage(redis: AuthRedisClient, prefix = "auth-secondary") {
	return {
		async get(key: string) {
			return await redis.get(createStorageKey(prefix, key))
		},
		async set(key: string, value: string, ttl?: number) {
			const storageKey = createStorageKey(prefix, key)
			if (ttl) {
				await redis.setEx(storageKey, ttl, value)
				return
			}

			await redis.set(storageKey, value)
		},
		async delete(key: string) {
			await redis.del(createStorageKey(prefix, key))
		},
	}
}

export function createStorageKey(prefix: string, key: string) {
	return `${prefix}:${key}`
}
