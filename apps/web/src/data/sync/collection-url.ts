import { fetchAuthAccessToken } from "@strawdev/auth-client"

import { apiUrl } from "@/data/api-url"

export function collectionUrl(name: string, params: Record<string, string> = {}) {
	const url = new URL(apiUrl(`/api/collections/${encodeURIComponent(name)}`))
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value)
	}
	return url.toString()
}

export const electricAuthHeaders = {
	authorization: async () => {
		const token = await fetchAuthAccessToken()
		return token ? `Bearer ${token}` : ""
	},
}

export const electricParser = {
	int8: (value: string) => Number(value),
}
