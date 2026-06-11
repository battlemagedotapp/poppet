import { createStarterNoteInputSchema } from "@strawdev/contracts/starter"
import { z } from "zod"

import { createStarterNote } from "../../modules/starter/service"
import { requireApiAuth } from "../server/context"
import { defineMutation, type MutationRegistry } from "./types"

export const mutationRegistry: MutationRegistry = {
	"health.ping": defineMutation({
		input: z.object({}),
		run: () => ({ service: "poppet-api" }),
	}),
	"starter.createNote": defineMutation({
		auth: true,
		input: createStarterNoteInputSchema,
		run: async ({ ctx, input }) => {
			const auth = requireApiAuth(ctx)
			return await createStarterNote(ctx.db, { ...input, userRid: auth.userRid })
		},
		write: true,
	}),
}
