import { readdir, readFile, writeFile } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import { compile } from "@inlang/paraglide-js"

import { createParaglideConfig } from "../packages/core/locale/paraglide.config.mjs"

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const outdir = resolve(rootDir, "packages/core/locale/src/paraglide")

await compile(
	createParaglideConfig({
		project: resolve(rootDir, "packages/core/locale/project.inlang"),
		outdir,
	})
)

await trimGeneratedTrailingWhitespace(outdir)

async function trimGeneratedTrailingWhitespace(directory) {
	const entries = await readdir(directory, { withFileTypes: true })
	await Promise.all(
		entries.map(async (entry) => {
			const path = join(directory, entry.name)
			if (entry.isDirectory()) {
				await trimGeneratedTrailingWhitespace(path)
				return
			}
			if (!entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) return

			const source = await readFile(path, "utf8")
			const nextSource = normalizeGeneratedSource(source, path)
			if (nextSource !== source) await writeFile(path, nextSource)
		})
	)
}

function normalizeGeneratedSource(source, path) {
	const trimmedSource = source.replace(/[ \t]+$/gm, "")
	if (!path.endsWith("runtime.js")) return trimmedSource

	return trimmedSource.replace(
		`/** @type {any} */ (globalThis).__paraglide =
\t/** @type {any} */ (globalThis).__paraglide ?? {};
/** @type {any} */ (globalThis).__paraglide.ssr =
\t/** @type {any} */ (globalThis).__paraglide.ssr ?? {};`,
		`const globalThisAny = /** @type {any} */ (globalThis);
globalThisAny.__paraglide = globalThisAny.__paraglide ?? {};
globalThisAny.__paraglide.ssr = globalThisAny.__paraglide.ssr ?? {};`
	)
}
