// Brush strokes painted by src/scripts/bristle.ts. Points are a cubic Bézier in 0..1 of the canvas;
// width is a fraction of the canvas height; colours come from the engine's mixing ladders.
import { mixes } from './mixes';

type P = [number, number];
export interface StrokeSpec {
	pts: [P, P, P, P];
	width: number;
	ladder: string;
	reverse?: boolean;
	seed: number;
	/** 0..1: how much the paint runs out towards the end. */
	dry?: number;
}
export interface Stroke extends Omit<StrokeSpec, 'ladder' | 'reverse'> {
	colors: string[];
}

/** Resolve ladders to colours and serialise for a canvas's data-strokes attribute. */
export function strokes(specs: StrokeSpec[]): string {
	return JSON.stringify(
		specs.map(({ ladder, reverse, ...rest }) => {
			const mix = mixes.find((m) => m.id === ladder);
			if (!mix) throw new Error(`No mix "${ladder}" in mixes.ts`);
			const colors = reverse ? [...mix.pleinbook].reverse() : mix.pleinbook;
			return { ...rest, colors } satisfies Stroke;
		}),
	);
}

/** The scratchpad card in the Sketchbooks section: short palette-knife swatches. */
export const SWATCHES: StrokeSpec[] = [
	{ pts: [[0.05, 0.3], [0.2, 0.22], [0.4, 0.36], [0.58, 0.28]], width: 0.34, ladder: 'yellow-blue', seed: 41, dry: 0.4 },
	{ pts: [[0.5, 0.7], [0.62, 0.62], [0.8, 0.76], [0.95, 0.68]], width: 0.3, ladder: 'red-ultramarine', reverse: true, seed: 43, dry: 0.5 },
	{ pts: [[0.06, 0.74], [0.16, 0.68], [0.28, 0.8], [0.4, 0.74]], width: 0.24, ladder: 'black-yellow', reverse: true, seed: 47, dry: 0.7 },
	{ pts: [[0.66, 0.26], [0.74, 0.2], [0.86, 0.3], [0.95, 0.24]], width: 0.22, ladder: 'red-cyan', seed: 53, dry: 0.8 },
];
