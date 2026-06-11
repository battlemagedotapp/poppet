import { cn } from "@strawdev/ui/lib/utils"
import { OTPInputContext } from "input-otp"
import * as React from "react"

function InputOTPSlot({
	index,
	className,
	...props
}: React.ComponentProps<"div"> & {
	index: number
}) {
	const inputOTPContext = React.use(OTPInputContext)
	const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

	return (
		<div
			data-slot="input-otp-slot"
			data-active={isActive}
			className={cn(
				"border-input aria-invalid:border-destructive data-[active=true]:border-ring data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40 relative flex size-8 items-center justify-center border-y border-r text-xs transition-all outline-none first:rounded-none first:border-l last:rounded-none data-[active=true]:z-10 data-[active=true]:ring-1",
				className
			)}
			{...props}
		>
			{char}
			{hasFakeCaret && (
				<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
					<div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
				</div>
			)}
		</div>
	)
}

export { InputOTPSlot }
