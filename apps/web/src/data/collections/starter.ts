import { starterNoteRowSchema } from "@strawdev/contracts/starter"
import { createCollection } from "@tanstack/db"
import { electricCollectionOptions } from "@tanstack/electric-db-collection"

import { electricAuthHeaders, electricParser, collectionUrl } from "@/data/sync/collection-url"

export function createStarterCollections(scopeKey: string) {
	return {
		notes: createCollection(
			electricCollectionOptions({
				getKey: (row) => row.rid,
				id: `${scopeKey}:starter.notes`,
				schema: starterNoteRowSchema,
				shapeOptions: {
					headers: electricAuthHeaders,
					parser: electricParser,
					url: collectionUrl("starter.notes"),
				},
			})
		),
	}
}
