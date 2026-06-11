import { ZodError } from "zod"

export type ApiErrorCode =
	| "badRequest"
	| "conflict"
	| "forbidden"
	| "internal"
	| "methodNotAllowed"
	| "notFound"
	| "unauthorized"
	| "validation"

export class ApiHttpError extends Error {
	readonly code: ApiErrorCode
	readonly details?: unknown
	readonly status: number

	constructor(status: number, code: ApiErrorCode, message: string, details?: unknown) {
		super(message)
		this.code = code
		this.details = details
		this.name = "ApiHttpError"
		this.status = status
	}
}

export function apiErrorResponse(error: unknown) {
	const normalized = normalizeApiError(error)
	return jsonResponse(normalized.status, {
		ok: false as const,
		code: normalized.code,
		message: normalized.message,
		...(normalized.details === undefined ? {} : { details: normalized.details }),
	})
}

export function jsonResponse(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		headers: {
			"content-type": "application/json",
		},
		status,
	})
}

function normalizeApiError(error: unknown) {
	if (error instanceof ApiHttpError) return error

	if (error instanceof ZodError) {
		return new ApiHttpError(400, "validation", "Invalid request input.", error.flatten())
	}

	return new ApiHttpError(500, "internal", "Something went wrong.")
}
