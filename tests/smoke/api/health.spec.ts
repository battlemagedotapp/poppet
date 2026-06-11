import { expect, test } from "@playwright/test"
import { apiUrl } from "@strawdev/smoke-testing"

test("local API health endpoint responds", async ({ request }) => {
	const response = await request.get(apiUrl("/health"))

	expect(response.ok()).toBe(true)
	await expect(response.json()).resolves.toEqual({
		ok: true,
		service: "poppet-api",
	})
})
