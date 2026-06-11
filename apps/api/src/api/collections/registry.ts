import { requireApiAuth } from "../server/context"
import type { CollectionDefinition } from "./types"

export const collectionRegistry: Record<string, CollectionDefinition> = {
	"starter.notes": {
		resolve: (ctx) => {
			const auth = requireApiAuth(ctx)
			return {
				params: [auth.userRid],
				table: "starter_notes",
				where: "user_rid = $1",
			}
		},
	},
}
