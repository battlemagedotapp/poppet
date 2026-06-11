import { nanoid } from "nanoid"

export function createRid(prefix: string) {
	return `${prefix}_${nanoid()}`
}
