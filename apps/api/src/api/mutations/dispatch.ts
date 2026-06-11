import { withMutationTransaction } from "../db/tx"
import { createApiRequestContext } from "../server/context"
import { handleMutationRequestWithDependencies } from "./dispatch-core"
import { mutationRegistry } from "./registry"

export async function handleMutationRequest(request: Request) {
	return await handleMutationRequestWithDependencies(request, {
		createContext: createApiRequestContext,
		registry: mutationRegistry,
		withTransaction: async (callback) =>
			await withMutationTransaction(async (tx) => await callback(tx)),
	})
}
