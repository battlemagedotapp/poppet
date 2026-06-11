import { describe, expect, it, vi } from "vitest"

import { createTokenCache, normalizeAuthRoles } from "./index"

describe("Auth client contract helpers", () => {
	it("normalizes transferred Auth role claims for frontend session state", () => {
		expect(normalizeAuthRoles(["user", "admin", "unknown"])).toEqual(["user", "admin"])
		expect(normalizeAuthRoles(null)).toEqual(["user"])
	})

	it("caches valid JWT access tokens and coalesces concurrent loads", async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-30T00:00:00.000Z"))
		const load = vi.fn(async () => createJwt({ exp: Math.floor(Date.now() / 1000) + 120 }))
		const cache = createTokenCache({ expiresSkewMs: 30_000, load })

		const [firstToken, secondToken] = await Promise.all([cache.get(), cache.get()])
		const thirdToken = await cache.get()

		expect(firstToken).toBe(secondToken)
		expect(thirdToken).toBe(firstToken)
		expect(load).toHaveBeenCalledTimes(1)
		vi.useRealTimers()
	})

	it("reloads cached JWT access tokens inside the expiry skew", async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date("2026-05-30T00:00:00.000Z"))
		const load = vi
			.fn<() => Promise<string | null>>()
			.mockResolvedValueOnce(createJwt({ exp: Math.floor(Date.now() / 1000) + 40 }))
			.mockResolvedValueOnce(createJwt({ exp: Math.floor(Date.now() / 1000) + 120 }))
		const cache = createTokenCache({ expiresSkewMs: 30_000, load })

		const firstToken = await cache.get()
		vi.advanceTimersByTime(15_000)
		const secondToken = await cache.get()

		expect(secondToken).not.toBe(firstToken)
		expect(load).toHaveBeenCalledTimes(2)
		vi.useRealTimers()
	})
})

function createJwt(payload: Record<string, unknown>) {
	return `${base64UrlEncode({ alg: "none", typ: "JWT" })}.${base64UrlEncode(payload)}.signature`
}

function base64UrlEncode(value: Record<string, unknown>) {
	return Buffer.from(JSON.stringify(value), "utf8")
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/g, "")
}
