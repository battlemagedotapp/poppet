import * as m from "@strawdev/locale/paraglide/messages.js"
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router"

export const Route = createRootRouteWithContext<Record<string, never>>()({
	component: () => (
		<div className="min-h-dvh">
			<header className="border-b">
				<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
					<Link to="/" className="text-sm font-semibold">
						{m.app_name()}
					</Link>
					<nav className="flex items-center gap-4 text-sm">
						<Link to="/sign-in" activeProps={{ className: "text-primary" }}>
							{m.sign_in()}
						</Link>
						<Link to="/create-account" activeProps={{ className: "text-primary" }}>
							{m.create_account()}
						</Link>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-4 py-8">
				<Outlet />
			</main>
		</div>
	),
})
