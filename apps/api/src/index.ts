import { env } from "./env"
import { createApiServer } from "./server"

const server = createApiServer()

server.listen(env.API_PORT, () => {
	console.log(`Poppet API listening on http://localhost:${env.API_PORT}`)
})
