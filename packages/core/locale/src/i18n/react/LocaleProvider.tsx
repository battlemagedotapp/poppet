import {
	getLocale as getRuntimeLocale,
	setLocale as setRuntimeLocale,
} from "@strawdev/locale/paraglide/runtime.js"
import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"

import {
	DEFAULT_LOCALE,
	isSupportedLocale,
	type SupportedLocale,
	syncDocumentLanguage,
} from "../locale"
import { LocaleContext, type LocaleContextValue } from "./locale-context"

interface LocaleProviderProps {
	children: ReactNode
}

function getInitialLocale(): SupportedLocale {
	try {
		const locale = getRuntimeLocale()
		return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE
	} catch {
		return DEFAULT_LOCALE
	}
}

export function LocaleProvider({ children }: LocaleProviderProps) {
	const [locale, setLocaleState] = useState<SupportedLocale>(getInitialLocale)

	useEffect(() => {
		syncDocumentLanguage(locale)
	}, [locale])

	const setLocale = useCallback(
		(next: SupportedLocale) => {
			if (!isSupportedLocale(next) || next === locale) return
			void setRuntimeLocale(next)
			setLocaleState(next)
		},
		[locale]
	)

	const value = useMemo<LocaleContextValue>(
		() => ({
			locale,
			setLocale,
		}),
		[locale, setLocale]
	)

	return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
