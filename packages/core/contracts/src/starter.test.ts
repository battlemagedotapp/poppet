import { describe, expect, it } from "vitest"

import { createStarterNoteInputSchema, presentStarterNote } from "./starter.ts"

describe("starter contracts", () => {
	it("normalizes Electric note rows into public starter notes", () => {
		expect(
			presentStarterNote({
				content: "Hello from Electric",
				created_at: Date.UTC(2026, 0, 1),
				rid: "note_123",
				updated_at: String(Date.UTC(2026, 0, 2)),
				user_rid: "user_123",
			})
		).toEqual({
			content: "Hello from Electric",
			createdAt: "2026-01-01T00:00:00.000Z",
			rid: "note_123",
			updatedAt: "2026-01-02T00:00:00.000Z",
			userRid: "user_123",
		})
	})

	it("requires non-empty note content", () => {
		expect(createStarterNoteInputSchema.safeParse({ content: "Template note" }).success).toBe(true)
		expect(createStarterNoteInputSchema.safeParse({ content: "" }).success).toBe(false)
	})
})
