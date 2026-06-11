CREATE TABLE "account" (
	"accessToken" text,
	"accessTokenExpiresAt" timestamp,
	"accountId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"idToken" text,
	"password" text,
	"providerId" text NOT NULL,
	"refreshToken" text,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"updatedAt" timestamp NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jwks" (
	"alg" text,
	"createdAt" timestamp NOT NULL,
	"crv" text,
	"expiresAt" timestamp,
	"id" text PRIMARY KEY NOT NULL,
	"privateKey" text NOT NULL,
	"publicKey" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"createdAt" timestamp NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"ipAddress" text,
	"token" text NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"userAgent" text,
	"userId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"createdAt" timestamp NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"image" text,
	"name" text NOT NULL,
	"rid" text NOT NULL,
	"roles" jsonb NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"createdAt" timestamp NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "starter_notes" (
	"content" text NOT NULL,
	"created_at" bigint NOT NULL,
	"rid" text PRIMARY KEY NOT NULL,
	"updated_at" bigint NOT NULL,
	"user_rid" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "account_account_provider_idx" ON "account" USING btree ("accountId","providerId");--> statement-breakpoint
CREATE INDEX "account_user_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "session_token_idx" ON "session" USING btree ("token");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "user_rid_idx" ON "user" USING btree ("rid");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "starter_notes_user_created_idx" ON "starter_notes" USING btree ("user_rid","created_at");