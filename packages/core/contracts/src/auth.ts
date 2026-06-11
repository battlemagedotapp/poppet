import { z } from "zod"

export const authRoleSchema = z.enum(["admin", "user"])

export const authUserSchema = z.object({
	createdAt: z.string(),
	email: z.string().email(),
	name: z.string().min(1),
	rid: z.string().min(1),
	roles: z.array(authRoleSchema),
	updatedAt: z.string(),
})

export type AuthRole = z.infer<typeof authRoleSchema>
export type AuthUser = z.infer<typeof authUserSchema>
