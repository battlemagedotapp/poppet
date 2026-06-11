import { handleCollectionRequest } from "./collections/dispatch"
import { handleMutationRequest } from "./mutations/dispatch"

export async function handleApiSurfaceRequest(request: Request) {
	const { pathname } = new URL(request.url)

	if (pathname.startsWith("/api/mutations/")) {
		return await handleMutationRequest(request)
	}

	if (pathname.startsWith("/api/collections/")) {
		return await handleCollectionRequest(request)
	}

	return null
}
