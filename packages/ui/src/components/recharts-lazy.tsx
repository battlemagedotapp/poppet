import * as React from "react"
import type * as Recharts from "recharts"

function lazyRechartsComponent(name: keyof typeof import("recharts")) {
	return React.lazy(async () => {
		const module = await import("recharts")
		return {
			default: module[name] as React.ComponentType<unknown>,
		}
	})
}

export const Area = lazyRechartsComponent("Area") as unknown as typeof Recharts.Area
export const AreaChart = lazyRechartsComponent("AreaChart") as unknown as typeof Recharts.AreaChart
export const Bar = lazyRechartsComponent("Bar") as unknown as typeof Recharts.Bar
export const BarChart = lazyRechartsComponent("BarChart") as unknown as typeof Recharts.BarChart
export const CartesianGrid = lazyRechartsComponent(
	"CartesianGrid"
) as unknown as typeof Recharts.CartesianGrid
export const Label = lazyRechartsComponent("Label") as unknown as typeof Recharts.Label
export const Legend = lazyRechartsComponent("Legend") as unknown as typeof Recharts.Legend
export const Pie = lazyRechartsComponent("Pie") as unknown as typeof Recharts.Pie
export const PieChart = lazyRechartsComponent("PieChart") as unknown as typeof Recharts.PieChart
export const ResponsiveContainer = lazyRechartsComponent(
	"ResponsiveContainer"
) as unknown as typeof Recharts.ResponsiveContainer
export const Tooltip = lazyRechartsComponent("Tooltip") as unknown as typeof Recharts.Tooltip
export const XAxis = lazyRechartsComponent("XAxis") as unknown as typeof Recharts.XAxis
