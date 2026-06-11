import type { ApiRequestContext } from "../server/context"

export type CollectionDefinition = {
	resolve: (ctx: ApiRequestContext, url: URL) => Promise<ResolvedCollection> | ResolvedCollection
}

export type ResolvedCollection = {
	params?: string[]
	table: string
	where?: string
}
