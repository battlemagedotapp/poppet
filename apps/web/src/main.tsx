import { LocaleProvider, useLocale } from "@strawdev/locale/i18n/react"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import React from "react"
import ReactDOM from "react-dom/client"

import { routeTree } from "./routeTree.gen"

import "@strawdev/ui/style.css"

const router = createRouter({
	defaultPreloadStaleTime: 0,
	routeTree,
})

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<React.StrictMode>
			<LocaleProvider>
				<LocalizedApp />
			</LocaleProvider>
		</React.StrictMode>
	)
}

function LocalizedApp() {
	useLocale()

	return <RouterProvider router={router} />
}
