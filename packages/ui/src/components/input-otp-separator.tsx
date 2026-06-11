import { MinusIcon } from "@phosphor-icons/react"

function InputOTPSeparator({ ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="input-otp-separator"
			className="flex items-center [&_svg:not([class*='size-'])]:size-4"
			{...props}
		>
			<MinusIcon aria-hidden="true" />
		</div>
	)
}

export { InputOTPSeparator }
