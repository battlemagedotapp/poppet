export const SUPPORTED_LOCALES = ["en", "ja"] as const
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]
export const DEFAULT_LOCALE: SupportedLocale = "en"

export const HREFLANG_MAP: Record<SupportedLocale, string> = {
	en: "en",
	ja: "ja",
}

export const LOCALE_LABELS: Record<SupportedLocale, string> = {
	en: "English",
	ja: "日本語",
}

export function isSupportedLocale(value: string): value is SupportedLocale {
	return SUPPORTED_LOCALES.includes(value as SupportedLocale)
}

export function requireSupportedLocale(
	value: unknown,
	errorMessage = "Missing preferred locale"
): SupportedLocale {
	if (typeof value === "string" && isSupportedLocale(value)) {
		return value
	}

	throw new Error(errorMessage)
}
