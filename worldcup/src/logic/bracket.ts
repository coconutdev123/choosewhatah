export type Photo = {
	id: string
	name: string
	url: string
}

export const MAX_PHOTOS = 32

export function getRoundLabel(photoCount: number): string {
	if (photoCount <= 2) return "Final"
	if (photoCount <= 4) return "Semi-finals"
	if (photoCount <= 8) return "Quarter-finals"
	return `Round of ${photoCount}`
}

export function getRoundCount(photoCount: number): number {
	return Math.max(1, Math.ceil(Math.log2(photoCount)))
}
