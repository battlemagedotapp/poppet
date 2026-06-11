import { defineConfig, devices } from "@playwright/test"
import { readSmokeEnv } from "@strawdev/smoke-testing"

const smokeEnv = readSmokeEnv()
const startWebServer = process.env.SMOKE_START_WEB_SERVER === "1" && smokeEnv.envName === "local"

export default defineConfig({
	forbidOnly: false,
	fullyParallel: false,
	outputDir: "../../test-results/smoke",
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	reporter: "list",
	retries: 0,
	testDir: ".",
	use: {
		baseURL: smokeEnv.origin,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
		video: "retain-on-failure",
	},
	webServer: startWebServer
		? {
				command: "pnpm run dev:web",
				reuseExistingServer: true,
				timeout: 120_000,
				url: smokeEnv.origin,
			}
		: undefined,
	workers: 1,
})
