import { SidebarIcon } from "@phosphor-icons/react"
import { Button } from "@strawdev/ui/components/button"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@strawdev/ui/components/sheet"
import { cn } from "@strawdev/ui/lib/utils"
import * as React from "react"

import { SIDEBAR_WIDTH_MOBILE } from "./constants"
import { useSidebar } from "./context"

function Sidebar({
	side = "left",
	variant = "sidebar",
	collapsible = "offcanvas",
	className,
	children,
	dir,
	...props
}: React.ComponentProps<"div"> & {
	side?: "left" | "right"
	variant?: "sidebar" | "floating" | "inset"
	collapsible?: "offcanvas" | "icon" | "none"
}) {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

	if (collapsible === "none") {
		return (
			<div
				data-slot="sidebar"
				className={cn(
					"bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",
					className
				)}
				{...props}
			>
				{children}
			</div>
		)
	}

	if (isMobile) {
		return (
			<Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
				<SheetContent
					dir={dir}
					data-sidebar="sidebar"
					data-slot="sidebar"
					data-mobile="true"
					className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
					style={
						{
							"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
						} as React.CSSProperties
					}
					side={side}
				>
					<SheetHeader className="sr-only">
						<SheetTitle>Sidebar</SheetTitle>
						<SheetDescription>Displays the mobile sidebar.</SheetDescription>
					</SheetHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</SheetContent>
			</Sheet>
		)
	}

	return (
		<div
			className="group peer text-sidebar-foreground hidden md:block"
			data-state={state}
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-variant={variant}
			data-side={side}
			data-slot="sidebar"
		>
			<div
				data-slot="sidebar-gap"
				className={cn(
					"relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
					"group-data-[collapsible=offcanvas]:w-0",
					"group-data-[side=right]:rotate-180",
					variant === "floating" || variant === "inset"
						? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
						: "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
				)}
			/>
			<div
				data-slot="sidebar-container"
				data-side={side}
				className={cn(
					"fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=left]:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] data-[side=right]:right-0 data-[side=right]:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)] md:flex",
					variant === "floating" || variant === "inset"
						? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
						: "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
					className
				)}
				{...props}
			>
				<div
					data-sidebar="sidebar"
					data-slot="sidebar-inner"
					className="bg-sidebar group-data-[variant=floating]:ring-sidebar-border flex size-full flex-col group-data-[variant=floating]:rounded-none group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1"
				>
					{children}
				</div>
			</div>
		</div>
	)
}

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
	const { toggleSidebar } = useSidebar()

	return (
		<Button
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			variant="ghost"
			size="icon-sm"
			className={cn(className)}
			onClick={(event) => {
				onClick?.(event)
				toggleSidebar()
			}}
			{...props}
		>
			<SidebarIcon />
			<span className="sr-only">Toggle Sidebar</span>
		</Button>
	)
}

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
	const { toggleSidebar } = useSidebar()

	return (
		<button
			type="button"
			data-sidebar="rail"
			data-slot="sidebar-rail"
			aria-label="Toggle Sidebar"
			tabIndex={-1}
			onClick={toggleSidebar}
			title="Toggle Sidebar"
			className={cn(
				"hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:start-1/2 after:w-[2px] sm:flex ltr:-translate-x-1/2 rtl:-translate-x-1/2",
				"in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
				"[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
				"hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
				"[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
				"[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
				className
			)}
			{...props}
		/>
	)
}

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
	return (
		<main
			data-slot="sidebar-inset"
			className={cn(
				"bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-none md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
				className
			)}
			{...props}
		/>
	)
}

export { Sidebar, SidebarInset, SidebarRail, SidebarTrigger }
