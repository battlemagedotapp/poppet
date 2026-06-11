import { fetchAuthAccessToken } from "@strawdev/auth-client"

import { apiUrl } from "@/data/api-url"

type MutationSuccess<Result> = {
	ok: true
	result: Result
	txid?: number | string
}

type MutationFailure = {
	code: string
	details?: unknown
	message: string
	ok: false
}

export class MutationError extends Error {
	readonly code: string
	readonly details?: unknown

	constructor(response: MutationFailure) {
		super(response.message)
		this.code = response.code
		this.details = response.details
		this.name = "MutationError"
	}
}

export async function mutate<Result = unknown, Input = unknown>(
	name: string,
	input?: Input
): Promise<{ result: Result; txid?: number }> {
	const response = await fetch(apiUrl(`/api/mutations/${encodeURIComponent(name)}`), {
		body: JSON.stringify({ input: input ?? {} }),
		headers: await mutationHeaders(),
		method: "POST",
	})
	const body = await readMutationResponse<Result>(response)

	if (!response.ok || !body.ok) {
		throw new MutationError(body as MutationFailure)
	}

	return {
		result: body.result,
		txid: normalizeTxid(body.txid),
	}
}

async function mutationHeaders() {
	const headers = new Headers()
	headers.set("content-type", "application/json")
	const token = await fetchAuthAccessToken()
	if (token) headers.set("authorization", `Bearer ${token}`)
	return headers
}

async function readMutationResponse<Result>(response: Response) {
	try {
		const body = (await response.json()) as MutationFailure | MutationSuccess<Result>
		if (!body || typeof body !== "object" || typeof body.ok !== "boolean") {
			throw new Error("Invalid mutation response shape.")
		}
		return body
	} catch {
		throw new MutationError({
			code: "badResponse",
			message: response.ok
				? "Mutation returned an invalid response."
				: `Mutation failed with HTTP ${response.status}.`,
			ok: false,
		})
	}
}

function normalizeTxid(txid: number | string | undefined) {
	if (txid === undefined) return undefined
	const normalized = typeof txid === "number" ? txid : Number(txid)
	if (!Number.isFinite(normalized)) {
		throw new MutationError({
			code: "badResponse",
			message: "Mutation returned an invalid transaction id.",
			ok: false,
		})
	}
	return normalized
}
