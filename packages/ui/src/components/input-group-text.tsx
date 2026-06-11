import { cn } from "@strawdev/ui/lib/utils"
import * as React from "react"

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"text-muted-foreground flex items-center gap-2 text-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
				className
			)}
			{...props}
		/>
	)
}

export { InputGroupText }
