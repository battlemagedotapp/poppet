import { cn } from "@strawdev/ui/lib/utils"
import * as React from "react"

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
	return (
		<option
			data-slot="native-select-option"
			className={cn("bg-[Canvas] text-[CanvasText]", className)}
			{...props}
		/>
	)
}

export { NativeSelectOption }
