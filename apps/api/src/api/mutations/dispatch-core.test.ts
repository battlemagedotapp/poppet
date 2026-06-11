import { describe, expect, it, vi } from "vitest"
import { z } from "zod"

import type { ApiRequestContext } from "../server/context"
import { handleMutationRequestWithDependencies } from "./dispatch-core"
import type { MutationDispatchDependencies } from "./dispatch-core"

describe("handleMutationRequestWithDependencies", () => {
	it("returns a bad request envelope for malformed JSON", async () => {
		const response = await handleMutationRequestWithDependencies(
			new Request("http://localhost/api/mutations/health.ping", {
				body: "{",
				headers: {
					"content-type": "application/json",
				},
				method: "POST",
			}),
			createDispatchDeps()
		)

		await expect(response.json()).resolves.toMatchObject({
			code: "badRequest",
			message: "Mutation body must be valid JSON.",
			ok: false,
		})
		expect(response.status).toBe(400)
	})

	it("returns a not found envelope for unknown mutations", async () => {
		const response = await handleMutationRequestWithDependencies(
			new Request("http://localhost/api/mutations/missing", {
				body: "{}",
				headers: {
					"content-type": "application/json",
				},
				method: "POST",
			}),
			createDispatchDeps()
		)

		await expect(response.json()).resolves.toMatchObject({
			code: "notFound",
			ok: false,
		})
		expect(response.status).toBe(404)
	})

	it("requires auth for protected mutations", async () => {
		const response = await handleMutationRequestWithDependencies(
			new Request("http://localhost/api/mutations/starter.createNote", {
				body: JSON.stringify({ input: { content: "Hello" } }),
				headers: {
					"content-type": "application/json",
				},
				method: "POST",
			}),
			createDispatchDeps()
		)

		await expect(response.json()).resolves.toMatchObject({
			code: "unauthorized",
			ok: false,
		})
		expect(response.status).toBe(401)
	})

	it("wraps write mutations in transactions", async () => {
		const deps = createDispatchDeps({
			auth: {
				userEmail: "test@example.com",
				userName: "Test User",
				userPrincipalRef: "user:user_123",
				userRid: "user_123",
				userRoles: ["user"],
			},
		})
		const response = await handleMutationRequestWithDependencies(
			new Request("http://localhost/api/mutations/starter.createNote", {
				body: JSON.stringify({ input: { content: "Hello" } }),
				headers: {
					"content-type": "application/json",
				},
				method: "POST",
			}),
			deps
		)

		await expect(response.json()).resolves.toMatchObject({
			ok: true,
			result: {
				content: "Hello",
				userRid: "user_123",
			},
			txid: "42",
		})
		expect(deps.withTransaction).toHaveBeenCalledOnce()
	})
})

function createDispatchDeps(ctx: Partial<ApiRequestContext> = {}): MutationDispatchDependencies {
	return {
		createContext: vi.fn(() => ({ auth: null, ...ctx }) as ApiRequestContext),
		registry: {
			"health.ping": {
				input: z.object({}),
				run: () => ({ service: "poppet-api" }),
			},
			"starter.createNote": {
				auth: true,
				input: z.object({ content: z.string() }),
				run: ({ ctx: runCtx, input }) => ({
					content: input.content,
					rid: "note_123",
					userRid: runCtx.auth?.userRid,
				}),
				write: true,
			},
		},
		withTransaction: vi.fn(async (callback) => ({
			result: await callback({} as ApiRequestContext["db"]),
			txid: "42",
		})),
	}
}
