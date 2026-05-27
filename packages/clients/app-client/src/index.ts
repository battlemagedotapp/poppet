import type { AppType } from "@strawdev/app-service"
import { hc } from "hono/client"

export const createAppClient = (baseUrl: string) => {
	return hc<AppType>(baseUrl)
}

export type { AppType }
