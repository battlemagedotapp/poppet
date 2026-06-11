import { createApiRequestContext } from "../server/context"
import { apiErrorResponse, ApiHttpError } from "../server/errors"
import { buildElectricCollectionUrl } from "./electric-url"
import { collectionRegistry } from "./registry"

const exposedElectricHeaders = [
	"electric-cursor",
	"electric-handle",
	"electric-offset",
	"electric-schema",
	"electric-up-to-date",
]

export async function handleCollectionRequest(request: Request) {
	if (request.method !== "GET" && request.method !== "POST") {
		return apiErrorResponse(
			new ApiHttpError(405, "methodNotAllowed", "Collections support GET and POST only.")
		)
	}

	try {
		const ctx = await createApiRequestContext(request)
		const requestUrl = new URL(request.url)
		const collectionName = decodeURIComponent(requestUrl.pathname.split("/").at(-1) ?? "")
		const definition = collectionRegistry[collectionName]
		if (!definition) {
			throw new ApiHttpError(404, "notFound", `Unknown collection: ${collectionName}.`)
		}

		const collection = await definition.resolve(ctx, requestUrl)
		const electricUrl = buildElectricCollectionUrl(ctx, requestUrl, collection)
		const body = request.method === "POST" ? await request.text() : undefined
		const electricResponse = await fetch(electricUrl, {
			headers: forwardedElectricRequestHeaders(request.headers),
			method: request.method,
			signal: request.signal,
			...(body === undefined ? {} : { body }),
		})

		return new Response(electricResponse.body, {
			headers: electricResponseHeaders(electricResponse.headers),
			status: electricResponse.status,
			statusText: electricResponse.statusText,
		})
	} catch (error) {
		return apiErrorResponse(error)
	}
}

function forwardedElectricRequestHeaders(source: Headers) {
	const headers = new Headers()
	const accept = source.get("accept")
	if (accept) headers.set("accept", accept)
	const contentType = source.get("content-type")
	if (contentType) headers.set("content-type", contentType)
	return headers
}

function electricResponseHeaders(source: Headers) {
	const headers = new Headers(source)
	headers.delete("content-encoding")
	headers.delete("content-length")
	headers.set("access-control-expose-headers", exposedElectricHeaders.join(","))
	return headers
}
