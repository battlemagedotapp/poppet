// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react"
import type { ReactNode } from "react"
import { describe, expect, it } from "vitest"

import { useLocale } from "./locale-context"
import { LocaleProvider } from "./LocaleProvider"

function wrapper({ children }: { children: ReactNode }) {
	return <LocaleProvider>{children}</LocaleProvider>
}

describe("LocaleProvider", () => {
	it("provides a default locale and updates document language when switched", () => {
		const { result } = renderHook(() => useLocale(), { wrapper })

		expect(result.current.locale).toBe("en")

		act(() => {
			result.current.setLocale("ja")
		})

		expect(result.current.locale).toBe("ja")
		expect(document.documentElement.lang).toBe("ja")
	})
})
