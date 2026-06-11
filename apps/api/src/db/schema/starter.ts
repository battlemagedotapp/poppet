import { index, pgTable, text } from "drizzle-orm/pg-core"

import { millis, rid } from "./auth"

export const starterNotes = pgTable(
	"starter_notes",
	{
		content: text("content").notNull(),
		createdAt: millis("created_at"),
		rid: rid(),
		updatedAt: millis("updated_at"),
		userRid: text("user_rid").notNull(),
	},
	(table) => [index("starter_notes_user_created_idx").on(table.userRid, table.createdAt)]
)

export const starterSchemaTables = {
	starterNotes,
}

export type StarterNoteRecord = typeof starterNotes.$inferSelect
export type NewStarterNoteRecord = typeof starterNotes.$inferInsert
