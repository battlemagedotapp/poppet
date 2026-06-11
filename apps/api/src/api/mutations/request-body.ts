import { ApiHttpError } from "../server/errors"

export async function readMutationBody(request: Request) {
	const contentType = request.headers.get("content-type") ?? ""
	if (!contentType.includes("application/json")) {
		throw new ApiHttpError(400, "badRequest", "Mutation body must be JSON.")
	}

	try {
		const body = await request.json()
		if (!body || typeof body !== "object") {
			throw new ApiHttpError(400, "badRequest", "Mutation body must be an object.")
		}
		return body as { input?: unknown }
	} catch (error) {
		if (error instanceof ApiHttpError) throw error
		throw new ApiHttpError(400, "badRequest", "Mutation body must be valid JSON.")
	}
}
