import { z } from "zod"

export const starterWorkspaceSchema = z.object({
	createdAt: z.string(),
	name: z.string().min(1),
	rid: z.string().min(1),
	userRid: z.string().min(1),
})

export type StarterWorkspace = z.infer<typeof starterWorkspaceSchema>
