import { authClient } from "@strawdev/auth-client"
import * as m from "@strawdev/locale/paraglide/messages.js"
import { Button } from "@strawdev/ui"
import { Input } from "@strawdev/ui/components/input"
import { Label } from "@strawdev/ui/components/label"
import { useNavigate } from "@tanstack/react-router"
import type { FormEvent } from "react"
import { useReducer } from "react"

type AuthMode = "create-account" | "sign-in"
type AuthField = "email" | "name" | "password"

type AuthFormState = {
	email: string
	error: string | null
	isSubmitting: boolean
	name: string
	password: string
}

type AuthFormAction =
	| { type: "field"; field: AuthField; value: string }
	| { type: "submit-start" }
	| { type: "submit-error"; error: string }
	| { type: "submit-end" }

const initialAuthFormState: AuthFormState = {
	email: "",
	error: null,
	isSubmitting: false,
	name: "",
	password: "",
}

function authFormReducer(state: AuthFormState, action: AuthFormAction): AuthFormState {
	switch (action.type) {
		case "field":
			return { ...state, [action.field]: action.value }
		case "submit-start":
			return { ...state, error: null, isSubmitting: true }
		case "submit-error":
			return { ...state, error: action.error }
		case "submit-end":
			return { ...state, isSubmitting: false }
	}
}

export function AuthForm({ mode }: { mode: AuthMode }) {
	const navigate = useNavigate()
	const [{ email, error, isSubmitting, name, password }, dispatch] = useReducer(
		authFormReducer,
		initialAuthFormState
	)
	const isCreateAccount = mode === "create-account"

	const submit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		dispatch({ type: "submit-start" })

		try {
			const result = isCreateAccount
				? await authClient.signUp.email({
						email,
						name,
						password,
					})
				: await authClient.signIn.email({
						email,
						password,
					})

			if (result.error) {
				dispatch({ type: "submit-error", error: result.error.message ?? "Authentication failed." })
				return
			}

			await navigate({ to: "/", replace: true })
		} catch (caught) {
			dispatch({
				type: "submit-error",
				error: caught instanceof Error ? caught.message : "Authentication failed.",
			})
		} finally {
			dispatch({ type: "submit-end" })
		}
	}

	return (
		<form onSubmit={submit} className="mx-auto flex w-full max-w-sm flex-col gap-4">
			<div className="space-y-2">
				<Label htmlFor="email">{m.email()}</Label>
				<Input
					id="email"
					autoComplete="email"
					type="email"
					value={email}
					onChange={(event) =>
						dispatch({ type: "field", field: "email", value: event.target.value })
					}
					placeholder={m.enter_your_email()}
					required
				/>
			</div>
			{isCreateAccount ? (
				<div className="space-y-2">
					<Label htmlFor="name">{m.name()}</Label>
					<Input
						id="name"
						autoComplete="name"
						value={name}
						onChange={(event) =>
							dispatch({ type: "field", field: "name", value: event.target.value })
						}
						placeholder={m.enter_your_name()}
						required
					/>
				</div>
			) : null}
			<div className="space-y-2">
				<Label htmlFor="password">{m.password()}</Label>
				<Input
					id="password"
					autoComplete={isCreateAccount ? "new-password" : "current-password"}
					type="password"
					value={password}
					onChange={(event) =>
						dispatch({ type: "field", field: "password", value: event.target.value })
					}
					placeholder={m.enter_your_password()}
					required
				/>
			</div>
			{error ? <p className="text-destructive text-sm">{error}</p> : null}
			<Button type="submit" disabled={isSubmitting}>
				{isCreateAccount ? m.create_account() : m.sign_in()}
			</Button>
		</form>
	)
}
