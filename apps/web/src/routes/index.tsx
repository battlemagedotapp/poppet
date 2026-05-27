import { createAppClient } from "@strawdev/app-client"
import { createFileRoute } from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute("/")({
	component: Index,
})

const client = createAppClient("http://localhost:8080")

function Index() {
	const [pingMessage, setPingMessage] = useState<string>("Connecting to app-service...")
	const [messages, setMessages] = useState<{ id: number; content: string }[]>([])
	const [newContent, setNewContent] = useState<string>("")

	const loadData = async () => {
		try {
			const pingRes = await client.api.ping.$get()
			const pingData = await pingRes.json()
			setPingMessage(pingData.message)

			const msgRes = await client.api.messages.$get()
			const msgData = await msgRes.json()
			setMessages(msgData)
		} catch (err) {
			setPingMessage("Failed to connect to app-service")
			console.error("Error loading template data:", err)
		}
	}

	useEffect(() => {
		loadData()
	}, [])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!newContent.trim()) return

		try {
			const res = await client.api.messages.$post({
				json: { content: newContent },
			})
			const newMessage = await res.json()
			setMessages((prev) => [...prev, newMessage])
			setNewContent("")
		} catch (err) {
			console.error("Error submitting message:", err)
		}
	}

	return (
		<div className="space-y-4">
			<h1 className="text-2xl font-bold">Poppet Hello World</h1>
			<p>
				<strong>App Service Status:</strong> {pingMessage}
			</p>

			<hr className="border-gray-200" />

			<h2 className="text-lg font-semibold">Database Messages</h2>
			<form onSubmit={handleSubmit} className="mb-5 flex gap-2">
				<input
					type="text"
					value={newContent}
					onChange={(e) => setNewContent(e.target.value)}
					placeholder="Message content..."
					className="rounded border border-gray-300 p-1"
				/>
				<button
					type="submit"
					className="bg-gray-55 cursor-pointer rounded border border-gray-300 px-3 py-1 hover:bg-gray-100"
				>
					Save
				</button>
			</form>

			{messages.length === 0 ? (
				<p className="text-gray-500">No messages in database.</p>
			) : (
				<ul className="list-disc pl-5">
					{messages.map((m) => (
						<li key={m.id} className="mb-1">
							<strong>#{m.id}</strong>: {m.content}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
