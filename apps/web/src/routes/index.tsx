import { createFileRoute } from "@tanstack/react-router"

import { StarterWorkspace } from "@/features/starter/starter-workspace"

export const Route = createFileRoute("/")({
	component: StarterWorkspace,
})
