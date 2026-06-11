import { createServer, type IncomingMessage, type ServerResponse } from "node:http"

import { env } from "./env"
import { dispatchRawRequest, sendJson } from "./raw/dispatch"

export function createApiServer() {
	return createServer(handleApiRequest)
}

async function handleApiRequest(request: IncomingMessage, response: ServerResponse) {
	applyCors(request, response)

	if (request.method === "OPTIONS") {
		response.writeHead(204)
		response.end()
		return
	}

	const url = requestUrl(request)

	if (url.pathname === "/health") {
		sendJson(response, 200, { ok: true, service: "poppet-api" })
		return
	}

	await dispatchRawRequest(request, response, url.pathname)
}

function requestUrl(request: IncomingMessage) {
	const host = request.headers.host ?? "localhost"
	return new URL(request.url ?? "/", `http://${host}`)
}

function applyCors(request: IncomingMessage, response: ServerResponse) {
	const origin = request.headers.origin
	if (typeof origin === "string" && env.API_ALLOWED_ORIGINS.includes(origin)) {
		response.setHeader("access-control-allow-origin", origin)
		response.setHeader("access-control-allow-credentials", "true")
	}

	response.setHeader("access-control-allow-methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
	response.setHeader("access-control-allow-headers", "authorization,content-type,x-requested-with")
}
