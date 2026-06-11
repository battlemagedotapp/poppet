import { HREFLANG_MAP, type SupportedLocale } from "./supported-locales"

export const DOCUMENT_TRANSLATION_META = [{ name: "google", content: "notranslate" }] as const

export function syncDocumentLanguage(locale: SupportedLocale) {
	if (typeof document === "undefined") return
	document.documentElement.lang = HREFLANG_MAP[locale]
}
