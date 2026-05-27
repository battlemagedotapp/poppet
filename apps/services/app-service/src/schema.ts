import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core"

export const messages = pgTable("messages", {
	id: serial("id").primaryKey(),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert
