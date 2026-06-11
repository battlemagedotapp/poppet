import type { AuthRole } from "@strawdev/contracts/auth"

export interface ApiAuthContext {
	userEmail: string
	userName: string
	userPrincipalRef: string
	userRid: string
	userRoles: AuthRole[]
}
