export type LiveQueryStatusInput = {
	isError: boolean
	isReady: boolean
}

export type QueryStatus = "error" | "loading" | "ready"

export function getLiveQueryStatus(queries: readonly LiveQueryStatusInput[]): QueryStatus {
	if (queries.some((query) => query.isError)) return "error"
	if (queries.some((query) => !query.isReady)) return "loading"
	return "ready"
}
