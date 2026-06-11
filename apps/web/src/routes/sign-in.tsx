import * as m from "@strawdev/locale/paraglide/messages.js"
import { createFileRoute } from "@tanstack/react-router"

import { AuthForm } from "@/features/auth/auth-form"

export const Route = createFileRoute("/sign-in")({
	component: function SignInRoute() {
		return (
			<div className="space-y-6">
				<h1 className="text-center text-2xl font-semibold">{m.sign_in()}</h1>
				<AuthForm mode="sign-in" />
			</div>
		)
	},
})
