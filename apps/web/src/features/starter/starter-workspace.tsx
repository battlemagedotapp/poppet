import { authClient, notifyAuthSignOut, useAuthSession } from "@strawdev/auth-client"
import { presentStarterNote, type StarterNote } from "@strawdev/contracts/starter"
import { useLocale } from "@strawdev/locale"
import * as m from "@strawdev/locale/paraglide/messages.js"
import { Button } from "@strawdev/ui"
import { Input } from "@strawdev/ui/components/input"
import { Label } from "@strawdev/ui/components/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@strawdev/ui/components/select"
import { useLiveQuery } from "@tanstack/react-db"
import { Link } from "@tanstack/react-router"
import type { FormEvent } from "react"
import { useMemo, useState } from "react"

import { getLiveQueryStatus } from "@/data/collections/query-status"
import { createStarterCollections } from "@/data/collections/starter"
import { mutate } from "@/data/mutations/client"

async function signOut() {
	await authClient.signOut()
	notifyAuthSignOut()
}

export function StarterWorkspace() {
	const session = useAuthSession()

	if (session.status === "loading") {
		return <div className="text-muted-foreground text-sm">{m.checking_session()}</div>
	}

	if (!session.user) {
		return (
			<div className="mx-auto flex w-full max-w-sm flex-col gap-3">
				<Button asChild>
					<Link to="/sign-in">{m.sign_in()}</Link>
				</Button>
				<Button asChild variant="secondary">
					<Link to="/create-account">{m.create_account()}</Link>
				</Button>
			</div>
		)
	}

	return <AuthenticatedStarterWorkspace userEmail={session.user.email} userRid={session.user.rid} />
}

function AuthenticatedStarterWorkspace({
	userEmail,
	userRid,
}: {
	userEmail: string
	userRid: string
}) {
	const { locale, setLocale } = useLocale()
	const [content, setContent] = useState("")
	const [error, setError] = useState<string | null>(null)
	const [isCreating, setIsCreating] = useState(false)
	const collections = useMemo(() => createStarterCollections(userRid), [userRid])
	const notesQuery = useLiveQuery(() => collections.notes, [collections])
	const queryStatus = getLiveQueryStatus([notesQuery])
	const notes = useMemo(
		() =>
			(notesQuery.data ?? [])
				.map((row) => presentStarterNote(row))
				.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
		[notesQuery.data]
	)

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const nextContent = content.trim()
		if (!nextContent) return

		setError(null)
		setIsCreating(true)
		try {
			await mutate<StarterNote>("starter.createNote", { content: nextContent })
			setContent("")
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "Could not create note.")
		} finally {
			setIsCreating(false)
		}
	}

	return (
		<div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
			<section className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-semibold">{m.protected_workspace()}</h1>
					<p className="text-muted-foreground mt-1 text-sm">
						{m.signed_in_as_email({ email: userEmail })}
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Label htmlFor="locale" className="sr-only">
						{m.language()}
					</Label>
					<Select value={locale} onValueChange={(value) => setLocale(value as typeof locale)}>
						<SelectTrigger id="locale" className="w-32">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="en">English</SelectItem>
							<SelectItem value="ja">日本語</SelectItem>
						</SelectContent>
					</Select>
					<Button type="button" variant="secondary" onClick={signOut}>
						{m.sign_out()}
					</Button>
				</div>
			</section>

			<form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
				<Label htmlFor="note-content" className="sr-only">
					{m.enter_a_note()}
				</Label>
				<Input
					id="note-content"
					value={content}
					onChange={(event) => setContent(event.target.value)}
					placeholder={m.enter_a_note()}
					maxLength={280}
				/>
				<Button type="submit" disabled={isCreating || !content.trim()}>
					{m.create_note()}
				</Button>
			</form>
			{error ? <p className="text-destructive text-sm">{error}</p> : null}

			<section className="space-y-3">
				<h2 className="text-lg font-medium">{m.notes()}</h2>
				{queryStatus === "loading" ? (
					<p className="text-muted-foreground text-sm">{m.loading()}</p>
				) : null}
				{queryStatus === "error" ? (
					<p className="text-destructive text-sm">Notes could not load.</p>
				) : null}
				<ul className="divide-border overflow-hidden rounded-md border">
					{notes.map((note) => (
						<li key={note.rid} className="bg-card px-4 py-3">
							<p className="text-sm">{note.content}</p>
							<p className="text-muted-foreground mt-1 text-xs">
								{new Date(note.createdAt).toLocaleString()}
							</p>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}
