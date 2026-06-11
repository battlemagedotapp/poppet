export function createParaglideConfig({ project, outdir }) {
	return {
		project,
		outdir,
		cookieName: "poppet_locale",
		emitTsDeclarations: true,
		outputStructure: "locale-modules",
		strategy: ["cookie", "baseLocale"],
		urlPatterns: [],
		routeStrategies: [],
	}
}
