import { describe, expect, it } from "vitest"

import type { ApiRequestContext } from "../server/context"
import { buildElectricCollectionUrl } from "./electric-url"

describe("buildElectricCollectionUrl", () => {
	it("keeps Electric protocol params while server-owning table filters", () => {
		const url = buildElectricCollectionUrl(
			{
				env: {
					ELECTRIC_SECRET: "secret",
					ELECTRIC_URL: "http://electric:3000",
				},
			} as ApiRequestContext,
			new URL("http://localhost/api/collections/starter.notes?offset=1&table=ignored"),
			{
				params: ["user_123"],
				table: "starter_notes",
				where: "user_rid = $1",
			}
		)

		expect(url.origin).toBe("http://electric:3000")
		expect(url.pathname).toBe("/v1/shape")
		expect(url.searchParams.get("table")).toBe("starter_notes")
		expect(url.searchParams.get("where")).toBe("user_rid = $1")
		expect(url.searchParams.get("params[1]")).toBe("user_123")
		expect(url.searchParams.get("secret")).toBe("secret")
		expect(url.searchParams.get("offset")).toBe("1")
	})
})
