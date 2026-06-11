import type { z } from "zod"

import type { ApiRequestContext } from "../server/context"

export interface MutationDefinition<Input = any, Result = unknown> {
	auth?: boolean
	input: z.ZodType<Input>
	run: (args: { ctx: ApiRequestContext; input: Input }) => Promise<Result> | Result
	write?: boolean
}

export function defineMutation<Input, Result>(definition: MutationDefinition<Input, Result>) {
	return definition
}

export type MutationRegistry = Record<string, MutationDefinition>
