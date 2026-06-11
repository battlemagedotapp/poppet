import type { ReactDoctorConfig } from "react-doctor/api"

export default {
	lint: true,
	deadCode: true,
	failOn: "warning",
	ignore: {
		files: ["dist/**", "src/routeTree.gen.ts"],
	},
} satisfies ReactDoctorConfig
