import { ELECTRIC_PROTOCOL_QUERY_PARAMS } from "@electric-sql/client"

import type { ApiRequestContext } from "../server/context"
import type { ResolvedCollection } from "./types"

export function buildElectricCollectionUrl(
	ctx: Pick<ApiRequestContext, "env">,
	requestUrl: URL,
	collection: ResolvedCollection
) {
	const electricUrl = new URL("/v1/shape", ctx.env.ELECTRIC_URL)

	for (const [key, value] of requestUrl.searchParams) {
		if (ELECTRIC_PROTOCOL_QUERY_PARAMS.includes(key)) {
			electricUrl.searchParams.append(key, value)
		}
	}

	electricUrl.searchParams.set("table", collection.table)
	if (collection.where) electricUrl.searchParams.set("where", collection.where)
	for (const [index, value] of (collection.params ?? []).entries()) {
		electricUrl.searchParams.set(`params[${index + 1}]`, value)
	}
	electricUrl.searchParams.set("secret", ctx.env.ELECTRIC_SECRET)

	return electricUrl
}
