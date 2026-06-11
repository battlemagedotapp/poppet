import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http"
import { Readable } from "node:stream"

import { handleApiSurfaceRequest } from "../api/http"
import { getAuthRuntime } from "../modules/auth/runtime"

export async function dispatchRawRequest(
	request: IncomingMessage,
	response: ServerResponse,
	pathname: string
) {
	const webRequest = nodeRequestToWebRequest(request)

	if (pathname.startsWith("/api/auth/")) {
		const { auth } = await getAuthRuntime()
		const authResponse = await auth.handler(webRequest)
		await writeWebResponse(response, authResponse)
		return
	}

	if (pathname.startsWith("/api/")) {
		const apiResponse = await handleApiSurfaceRequest(webRequest)
		if (apiResponse) {
			await writeWebResponse(response, apiResponse)
			return
		}
	}

	sendJson(response, 404, {
		error: "notFound",
		message: `No API route is registered for ${pathname}.`,
	})
}

export function sendJson(response: ServerResponse, status: number, body: unknown) {
	response.writeHead(status, { "content-type": "application/json" })
	response.end(JSON.stringify(body))
}

function nodeRequestToWebRequest(request: IncomingMessage) {
	const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`)
	const method = request.method ?? "GET"
	const init: RequestInit & { duplex?: "half" } = {
		headers: headersFromIncoming(request.headers),
		method,
	}

	if (method !== "GET" && method !== "HEAD") {
		init.body = Readable.toWeb(request) as ReadableStream<Uint8Array>
		init.duplex = "half"
	}

	return new Request(url, init)
}

function headersFromIncoming(headers: IncomingHttpHeaders) {
	const result = new Headers()

	for (const [key, value] of Object.entries(headers)) {
		if (!value) continue
		if (Array.isArray(value)) {
			for (const item of value) {
				result.append(key, item)
			}
			continue
		}
		result.set(key, value)
	}

	return result
}

async function writeWebResponse(response: ServerResponse, webResponse: Response) {
	for (const [name, value] of webResponse.headers.entries()) {
		if (name.toLowerCase() !== "set-cookie") {
			response.setHeader(name, value)
		}
	}

	const setCookieHeaders = getSetCookieHeaders(webResponse.headers)
	if (setCookieHeaders.length) {
		response.setHeader("set-cookie", setCookieHeaders)
	}

	response.writeHead(webResponse.status)
	if (webResponse.body) {
		const body = Readable.fromWeb(webResponse.body as any)
		body.pipe(response)
		return
	}
	response.end()
}

function getSetCookieHeaders(headers: Headers) {
	const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] }
	if (withGetSetCookie.getSetCookie) return withGetSetCookie.getSetCookie()
	const setCookie = headers.get("set-cookie")
	return setCookie ? [setCookie] : []
}
