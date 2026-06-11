import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

export type SmokeEnvName = "dev" | "local" | "prod"

export type SmokeEnv = {
	apiBaseUrl: string
	envName: SmokeEnvName
	origin: string
	repoRoot: string
}

type SmokeRuntimeEnv = Record<string, string | undefined>

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..")

export function readSmokeEnv(): SmokeEnv {
	const envName = smokeEnvName(process.env.SMOKE_ENV)
	const fileEnv = readEnvFile(resolve(repoRoot, `infra/smoke/env/${envName}.env`))

	return {
		apiBaseUrl: stripTrailingSlash(
			process.env.API_BASE_URL ?? fileEnv.API_BASE_URL ?? "http://localhost:6201"
		),
		envName,
		origin: stripTrailingSlash(
			process.env.SMOKE_ORIGIN ?? fileEnv.SMOKE_ORIGIN ?? "http://localhost:6200"
		),
		repoRoot,
	}
}

export function smokeUrl(path: string, env = readSmokeEnv()) {
	return `${env.origin}${path.startsWith("/") ? path : `/${path}`}`
}

export function apiUrl(path: string, env = readSmokeEnv()) {
	return `${env.apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`
}

function smokeEnvName(value: string | undefined): SmokeEnvName {
	if (value === "dev" || value === "prod") return value
	return "local"
}

function readEnvFile(filePath: string): SmokeRuntimeEnv {
	if (!existsSync(filePath)) return {}

	const parsed: SmokeRuntimeEnv = {}
	const content = readFileSync(filePath, "utf8")
	for (const line of content.split(/\r?\n/)) {
		const trimmed = line.trim()
		if (!trimmed || trimmed.startsWith("#")) continue

		const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed)
		if (!match) continue

		parsed[match[1]] = parseEnvValue(match[2])
	}
	return parsed
}

function parseEnvValue(value: string) {
	const trimmed = value.trim()
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1)
	}
	return trimmed
}

function stripTrailingSlash(value: string) {
	return value.replace(/\/$/, "")
}
