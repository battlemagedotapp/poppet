import { createRootRoute, Outlet, Link } from "@tanstack/react-router"

export const Route = createRootRoute({
	component: () => (
		<div className="p-5 font-sans">
			<header className="mb-5 flex items-center gap-4">
				<strong className="text-lg font-bold">poppet</strong>
				<nav>
					<Link
						to="/"
						activeProps={{ className: "font-bold" }}
						className="text-inherit no-underline"
					>
						Home
					</Link>
				</nav>
			</header>
			<hr />
			<main className="mt-5">
				<Outlet />
			</main>
		</div>
	),
})
