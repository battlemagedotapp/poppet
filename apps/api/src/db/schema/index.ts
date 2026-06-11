export * from "./auth"
export * from "./starter"

import { authSchemaTables } from "./auth"
import { starterSchemaTables } from "./starter"

export const apiSchemaTables = {
	...authSchemaTables,
	...starterSchemaTables,
}
