import { createContext, useContext } from "react"

import type { SupportedLocale } from "../locale"

export interface LocaleContextValue {
	locale: SupportedLocale
	setLocale: (locale: SupportedLocale) => void
}

export const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocale() {
	const context = useContext(LocaleContext)
	if (!context) {
		throw new Error("useLocale must be used within LocaleProvider")
	}

	return context
}
