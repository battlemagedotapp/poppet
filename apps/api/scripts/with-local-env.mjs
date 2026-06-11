#!/usr/bin/env node

import { spawnSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const command = process.argv[2]
const args = process.argv.slice(3)

if (!command) {
	console.error("Usage: node scripts/with-local-env.mjs <command> [...args]")
	process.exit(1)
}

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const envFile = resolve(apiRoot, "../../infra/runtime/env/local.env")
const fileEnv = readEnvFile(envFile)
const result = spawnSync(command, args, {
	env: { ...fileEnv, ...process.env },
	stdio: "inherit",
})

if (result.error) {
	console.error(result.error.message)
	process.exit(1)
}

process.exit(result.status ?? 1)

function readEnvFile(filePath) {
	if (!existsSync(filePath)) return {}

	const parsed = {}
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

function parseEnvValue(value) {
	const trimmed = value.trim()
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1)
	}
	return trimmed
}
