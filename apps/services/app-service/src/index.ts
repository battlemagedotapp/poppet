import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"

import { db } from "./db.ts"
import { env } from "./env.ts"
import { messages } from "./schema.ts"

const app = new Hono().basePath("/api")

// Enable CORS so the React app can talk to it
app.use("*", cors())

const routes = app
	.get("/ping", (c) => c.json({ message: "hello world from app-service" }))
	.get("/messages", async (c) => {
		const allMessages = await db.select().from(messages)
		return c.json(allMessages)
	})
	.post("/messages", async (c) => {
		const body = await c.req.json()
		const [inserted] = await db.insert(messages).values({ content: body.content }).returning()
		return c.json(inserted)
	})

export type AppType = typeof routes

if (process.env.NODE_ENV !== "test") {
	console.log(`Server starting on port ${env.PORT}...`)

	serve({
		fetch: app.fetch,
		port: env.PORT,
	})
}

export default app
