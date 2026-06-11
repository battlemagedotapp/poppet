import {
	presentStarterNote,
	type CreateStarterNoteInput,
	type StarterNote,
} from "@strawdev/contracts/starter"

import type { ApiDb } from "../../db/client"
import { starterNotes } from "../../db/schema"
import { createRid } from "../rids"

export async function createStarterNote(
	db: ApiDb,
	input: CreateStarterNoteInput & { userRid: string }
): Promise<StarterNote> {
	const now = Date.now()
	const [inserted] = await db
		.insert(starterNotes)
		.values({
			content: input.content,
			createdAt: now,
			rid: createRid("note"),
			updatedAt: now,
			userRid: input.userRid,
		})
		.returning()

	if (!inserted) throw new Error("Starter note could not be created.")
	return presentStarterNote({
		content: inserted.content,
		created_at: inserted.createdAt,
		rid: inserted.rid,
		updated_at: inserted.updatedAt,
		user_rid: inserted.userRid,
	})
}
