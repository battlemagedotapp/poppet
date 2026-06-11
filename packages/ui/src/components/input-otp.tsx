import { cn } from "@strawdev/ui/lib/utils"
import { OTPInput } from "input-otp"

function InputOTP({
	className,
	containerClassName,
	...props
}: React.ComponentProps<typeof OTPInput> & {
	containerClassName?: string
}) {
	return (
		<OTPInput
			data-slot="input-otp"
			containerClassName={cn(
				"cn-input-otp flex items-center has-disabled:opacity-50",
				containerClassName
			)}
			spellCheck={false}
			className={cn("disabled:cursor-not-allowed", className)}
			{...props}
		/>
	)
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="input-otp-group"
			className={cn(
				"has-aria-invalid:border-destructive has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40 flex items-center rounded-none has-aria-invalid:ring-1",
				className
			)}
			{...props}
		/>
	)
}

export { InputOTPSeparator } from "./input-otp-separator"
export { InputOTPSlot } from "./input-otp-slot"
export { InputOTP, InputOTPGroup }
