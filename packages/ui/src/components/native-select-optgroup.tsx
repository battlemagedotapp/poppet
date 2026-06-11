import { cn } from "@strawdev/ui/lib/utils"
import * as React from "react"

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
	return (
		<optgroup
			data-slot="native-select-optgroup"
			className={cn("bg-[Canvas] text-[CanvasText]", className)}
			{...props}
		/>
	)
}

export { NativeSelectOptGroup }
