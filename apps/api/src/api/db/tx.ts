import { sql } from "drizzle-orm"

import { db, type ApiTransaction } from "../../db/client"

export async function withMutationTransaction<T>(
	callback: (tx: ApiTransaction) => Promise<T>
): Promise<{ result: T; txid: string }> {
	return await db.transaction(async (tx) => {
		const result = await callback(tx)
		const txid = await currentTransactionId(tx)
		return { result, txid }
	})
}

async function currentTransactionId(tx: ApiTransaction) {
	const response = await tx.execute<{ txid: string }>(
		sql`select pg_current_xact_id()::xid::text as txid`
	)
	const row = response.rows[0]
	return row?.txid ?? "0"
}
