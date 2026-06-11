import { bigint, boolean, index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const user = pgTable(
	"user",
	{
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		email: text("email").notNull(),
		emailVerified: boolean("emailVerified").notNull(),
		id: text("id").primaryKey(),
		image: text("image"),
		name: text("name").notNull(),
		rid: text("rid").notNull(),
		roles: jsonb("roles").$type<string[]>().notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
	},
	(table) => [index("user_email_idx").on(table.email), index("user_rid_idx").on(table.rid)]
)

export const session = pgTable(
	"session",
	{
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
		id: text("id").primaryKey(),
		ipAddress: text("ipAddress"),
		token: text("token").notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
		userAgent: text("userAgent"),
		userId: text("userId").notNull(),
	},
	(table) => [
		index("session_token_idx").on(table.token),
		index("session_user_idx").on(table.userId),
	]
)

export const account = pgTable(
	"account",
	{
		accessToken: text("accessToken"),
		accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
		accountId: text("accountId").notNull(),
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		id: text("id").primaryKey(),
		idToken: text("idToken"),
		password: text("password"),
		providerId: text("providerId").notNull(),
		refreshToken: text("refreshToken"),
		refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
		scope: text("scope"),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
		userId: text("userId").notNull(),
	},
	(table) => [
		index("account_account_provider_idx").on(table.accountId, table.providerId),
		index("account_user_idx").on(table.userId),
	]
)

export const verification = pgTable(
	"verification",
	{
		createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
		expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
		value: text("value").notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const jwks = pgTable("jwks", {
	alg: text("alg"),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
	crv: text("crv"),
	expiresAt: timestamp("expiresAt", { mode: "date" }),
	id: text("id").primaryKey(),
	privateKey: text("privateKey").notNull(),
	publicKey: text("publicKey").notNull(),
})

export const authSchemaTables = {
	account,
	jwks,
	session,
	user,
	verification,
}

export type AuthDbSchema = typeof authSchemaTables

export const millis = (name: string) => bigint(name, { mode: "number" }).notNull()
export const rid = (name = "rid") => text(name).primaryKey()
