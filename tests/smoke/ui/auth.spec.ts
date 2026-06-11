import { expect, test } from "@playwright/test"
import { smokeUrl } from "@strawdev/smoke-testing"

const smokePassword = "Poppet-smoke-password-1"

test("unauthenticated users can reach auth routes", async ({ page }) => {
	await page.goto(smokeUrl("/"))
	const main = page.getByRole("main")

	await expect(main.getByRole("link", { name: "Sign in" })).toBeVisible()
	await main.getByRole("link", { name: "Create account" }).click()
	await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible()
})

test("users can create an account and sign back in", async ({ page }) => {
	const runId = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`
	const email = `smoke-${runId}@example.test`
	const name = `Smoke ${runId}`
	const main = page.getByRole("main")

	await page.goto(smokeUrl("/create-account"))
	await main.getByLabel("Email").fill(email)
	await main.getByLabel("Name").fill(name)
	await main.getByLabel("Password").fill(smokePassword)
	await main.getByRole("button", { name: "Create account" }).click()

	await expect(page.getByRole("heading", { name: "Protected workspace" })).toBeVisible()
	await expect(page.getByText(`Signed in as ${email}`)).toBeVisible()

	await main.getByRole("button", { name: "Sign out" }).click()
	await expect(main.getByRole("link", { name: "Sign in" })).toBeVisible()

	await main.getByRole("link", { name: "Sign in" }).click()
	await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
	await main.getByLabel("Email").fill(email)
	await main.getByLabel("Password").fill(smokePassword)
	await main.getByRole("button", { name: "Sign in" }).click()

	await expect(page.getByRole("heading", { name: "Protected workspace" })).toBeVisible()
	await expect(page.getByText(`Signed in as ${email}`)).toBeVisible()
})
