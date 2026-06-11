import { cn } from "@strawdev/ui/lib/utils"
import { Avatar as AvatarPrimitive } from "radix-ui"
import * as React from "react"

function AvatarFallback({
	className,
	...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
	return (
		<AvatarPrimitive.Fallback
			data-slot="avatar-fallback"
			className={cn(
				"bg-muted text-muted-foreground flex size-full items-center justify-center rounded-full text-sm group-data-[size=sm]/avatar:text-xs",
				className
			)}
			{...props}
		/>
	)
}

export { AvatarFallback }
