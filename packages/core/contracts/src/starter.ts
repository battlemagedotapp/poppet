import { z } from "zod"

export const starterNoteSchema = z.object({
	content: z.string(),
	createdAt: z.string(),
	rid: z.string().min(1),
	updatedAt: z.string(),
	userRid: z.string().min(1),
})

export const starterNoteRowSchema = z
	.object({
		content: z.string(),
		created_at: z.union([z.number(), z.string().regex(/^\d+$/)]),
		rid: z.string(),
		updated_at: z.union([z.number(), z.string().regex(/^\d+$/)]),
		user_rid: z.string(),
	})
	.passthrough()

export const createStarterNoteInputSchema = z.object({
	content: z.string().trim().min(1).max(280),
})

export type CreateStarterNoteInput = z.infer<typeof createStarterNoteInputSchema>
export type StarterNote = z.infer<typeof starterNoteSchema>
export type StarterNoteRow = z.infer<typeof starterNoteRowSchema>

export function presentStarterNote(row: StarterNoteRow): StarterNote {
	return {
		content: row.content,
		createdAt: toIso(row.created_at),
		rid: row.rid,
		updatedAt: toIso(row.updated_at),
		userRid: row.user_rid,
	}
}

function toIso(value: number | string) {
	const timestamp = typeof value === "number" ? value : Number(value)
	if (!Number.isFinite(timestamp)) {
		throw new Error(`Invalid starter note timestamp: ${String(value)}`)
	}

	const date = new Date(timestamp)
	if (!Number.isFinite(date.getTime())) {
		throw new Error(`Invalid starter note timestamp: ${String(value)}`)
	}

	return date.toISOString()
}
