import { expect, test } from "vitest"

import app from "./index"

test("GET /api/ping returns hello world", async () => {
	const res = await app.request("/api/ping")
	expect(res.status).toBe(200)
	expect(await res.json()).toEqual({ message: "hello world from app-service" })
})
