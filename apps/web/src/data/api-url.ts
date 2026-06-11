export const apiBaseUrl = (
	(import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:6201"
).replace(/\/$/, "")

export function apiUrl(path: string) {
	return `${apiBaseUrl}${path.startsWith("/") ? path : `/${path}`}`
}
