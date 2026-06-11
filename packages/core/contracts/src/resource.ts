import { z } from "zod"

export const starterResourceKindSchema = z.enum(["note"])

export const starterResourceSchema = z.object({
	createdAt: z.string(),
	kind: starterResourceKindSchema,
	rid: z.string().min(1),
	title: z.string().min(1),
	updatedAt: z.string(),
	userRid: z.string().min(1),
})

export type StarterResource = z.infer<typeof starterResourceSchema>
export type StarterResourceKind = z.infer<typeof starterResourceKindSchema>
