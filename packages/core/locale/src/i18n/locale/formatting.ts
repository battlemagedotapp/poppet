import { HREFLANG_MAP, type SupportedLocale } from "./supported-locales"

const DEFAULT_DATE_OPTIONS = {
	day: "numeric",
	month: "short",
	year: "numeric",
} satisfies Intl.DateTimeFormatOptions

const DEFAULT_TIME_OPTIONS = {
	hour: "numeric",
	minute: "2-digit",
} satisfies Intl.DateTimeFormatOptions

function toDate(value: Date | number | string): Date {
	return value instanceof Date ? value : new Date(value)
}

export function formatLocalizedDate(
	value: Date | number | string,
	locale: SupportedLocale,
	options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS
) {
	return new Intl.DateTimeFormat(HREFLANG_MAP[locale], options).format(toDate(value))
}

export function formatLocalizedDateTime(
	value: Date | number | string,
	locale: SupportedLocale,
	options?: Intl.DateTimeFormatOptions
) {
	return new Intl.DateTimeFormat(HREFLANG_MAP[locale], options).format(toDate(value))
}

export function formatLocalizedTime(
	value: Date | number | string,
	locale: SupportedLocale,
	options: Intl.DateTimeFormatOptions = DEFAULT_TIME_OPTIONS
) {
	return new Intl.DateTimeFormat(HREFLANG_MAP[locale], options).format(toDate(value))
}
