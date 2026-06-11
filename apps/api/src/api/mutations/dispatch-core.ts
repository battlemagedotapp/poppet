import type { ApiRequestContext } from "../server/context"
import { apiErrorResponse, ApiHttpError, jsonResponse } from "../server/errors"
import { readMutationBody } from "./request-body"
import type { MutationRegistry } from "./types"

export interface MutationDispatchDependencies {
	createContext: (request: Request) => ApiRequestContext | Promise<ApiRequestContext>
	registry: MutationRegistry
	withTransaction: <T>(
		callback: (db: ApiRequestContext["db"]) => Promise<T>
	) => Promise<{ result: T; txid: string }>
}

export async function handleMutationRequestWithDependencies(
	request: Request,
	deps: MutationDispatchDependencies
) {
	if (request.method !== "POST") {
		return apiErrorResponse(
			new ApiHttpError(405, "methodNotAllowed", "Mutations must be called with POST.")
		)
	}

	try {
		const name = decodeURIComponent(new URL(request.url).pathname.split("/").at(-1) ?? "")
		const mutation = deps.registry[name]
		if (!mutation) throw new ApiHttpError(404, "notFound", `Unknown mutation: ${name}.`)

		const ctx = await deps.createContext(request)
		if (mutation.auth && !ctx.auth) {
			throw new ApiHttpError(401, "unauthorized", "Authentication is required.")
		}

		const body = await readMutationBody(request)
		const input = mutation.input.parse(body.input ?? {})

		if (mutation.write) {
			const { result, txid } = await deps.withTransaction(
				async (tx) => await mutation.run({ ctx: { ...ctx, db: tx }, input })
			)
			return jsonResponse(200, { ok: true as const, result, txid })
		}

		return jsonResponse(200, {
			ok: true as const,
			result: await mutation.run({ ctx, input }),
		})
	} catch (error) {
		return apiErrorResponse(error)
	}
}
