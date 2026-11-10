// Bristle brush strokes on a canvas. Each stroke is a few dozen bristles following a cubic curve,
// coloured along its length from a mixing ladder. Seeded, so a canvas draws the same every time.
//
//   <canvas data-strokes="[…]">        explicit strokes (specs in src/data/strokes.ts)
//   <canvas data-mix='{"colors":[…],"seed":1}'>
//                                      a mix strip: an underlayer plus rows of short overlapping strokes,
//                                      each coloured from its own stretch of the ladder, so the colour
//                                      blends from one end to the other in painted strokes.
import type { Stroke } from '../data/strokes';
type P = [number, number];
interface PaintStroke extends Stroke {
	/** The stretch of the ladder this stroke runs over, from its start to its end. Default [0, 1]. */
	range?: [number, number];
	bristles?: number;
	/** Lighten (+) or darken (−) the whole stroke, e.g. 0.06. */
	tone?: number;
	/** Scale the stroke's opacity. */
	opacity?: number;
}

function rng(seed: number) {
	let s = seed >>> 0 || 1;
	return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
function colourAt(ladder: number[][], t: number) {
	const x = Math.min(0.9999, Math.max(0, t)) * (ladder.length - 1);
	const i = Math.floor(x), f = x - i;
	return ladder[i].map((v, k) => v + (ladder[i + 1][k] - v) * f);
}
function bez(p: P[], t: number): P {
	const u = 1 - t;
	const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
	return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
}

function paint(ctx: CanvasRenderingContext2D, w: number, h: number, s: PaintStroke) {
	const ladder = s.colors.map(hex);
	const [r0, r1] = s.range ?? [0, 1];
	const rand = rng(s.seed);
	// Sample the curve finely enough for its length on screen.
	const approx = Math.hypot((s.pts[3][0] - s.pts[0][0]) * w, (s.pts[3][1] - s.pts[0][1]) * h);
	const STEPS = Math.max(30, Math.min(220, Math.round(approx / 4)));
	const pts: P[] = [];
	for (let i = 0; i <= STEPS; i++) {
		const [x, y] = bez(s.pts, i / STEPS);
		pts.push([x * w, y * h]);
	}
	const normals = pts.map((_, i) => {
		const a = pts[Math.max(0, i - 1)], b = pts[Math.min(STEPS, i + 1)];
		const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
		return [-dy / l, dx / l];
	});
	const half = (s.width * h) / 2;
	const BRISTLES = s.bristles ?? 80;
	const dry = s.dry ?? 0.6;
	const CHUNK = Math.max(3, Math.round(STEPS / 44));
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	for (let b = 0; b < BRISTLES; b++) {
		const o = (rand() * 2 - 1) * (0.55 + 0.45 * rand()); // across the brush, denser in the middle
		const edge = Math.abs(o);
		const t0 = rand() * 0.03 + edge * edge * 0.07;
		const t1 = 1 - rand() * 0.06 - edge * edge * edge * 0.2;
		const lw = Math.max(1, ((half * 2) / BRISTLES) * (1.8 + rand() * 2.4));
		const alpha = (0.55 + rand() * 0.4) * (s.opacity ?? 1);
		const shade = (rand() - 0.5) * 0.14 + (s.tone ?? 0);
		const wobble = rand() * 6.28;
		for (let i = Math.floor(t0 * STEPS); i < Math.floor(t1 * STEPS); i += CHUNK) {
			const t = i / STEPS;
			// paint runs out: gaps appear towards the end, more at the edges
			const gapChance = Math.max(0, (t - (1 - dry * 0.5)) * 2.2) * (0.4 + edge);
			if (rand() < gapChance) continue;
			const press = Math.min(1, t / 0.06) ** 0.5 * Math.min(1, (1 - t) / 0.12) ** 0.6;
			const c = colourAt(ladder, r0 + (r1 - r0) * clamp01(t + (rand() - 0.5) * 0.02)).map((v) =>
				Math.round(Math.min(255, Math.max(0, v * (1 + shade)))),
			);
			ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${alpha * (0.75 + 0.25 * press)})`;
			ctx.lineWidth = lw * (0.6 + 0.4 * press);
			ctx.beginPath();
			for (let j = i; j <= Math.min(i + CHUNK, STEPS); j++) {
				const tj = j / STEPS;
				const pj = Math.min(1, tj / 0.06) ** 0.5 * Math.min(1, (1 - tj) / 0.12) ** 0.6;
				const off = o * half * (0.35 + 0.65 * pj) + Math.sin(tj * 9 + wobble) * half * 0.03;
				const x = pts[j][0] + normals[j][0] * off, y = pts[j][1] + normals[j][1] * off;
				j === i ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
			}
			ctx.stroke();
		}
	}
}

/**
 * A mix strip, painted like a quick impressionist swatch on the card itself (no box, nothing cropped):
 * two passes of short diagonal dabs, each coloured from the stretch of the ladder under it and only
 * slightly lighter or darker than its neighbours, so the colour fades smoothly from end to end.
 * Everything stays inside the canvas with some breathing room.
 */
function mixStrokes(colors: string[], seed: number, aspect: number): PaintStroke[] {
	const rand = rng(seed);
	const mx = 0.12 / aspect; // side margin, about an eighth of the strip's height
	const fit = (x: number, y: number): P => [mx + x * (1 - 2 * mx), 0.06 + y * 0.88];
	const dabs: PaintStroke[] = [];
	const N = Math.round(aspect * 4.2);
	for (let pass = 0; pass < 2; pass++) {
		for (let i = 0; i < N; i++) {
			const len = 0.74 + rand() * 0.18; // in strip heights
			const angle = ((52 + (rand() - 0.5) * 30) * Math.PI) / 180;
			const dx = (Math.cos(angle) * len) / aspect / 2; // in strip widths
			const dy = (Math.sin(angle) * len) / 2; // in strip heights
			let cx = (i + 0.5 + pass * 0.5 + (rand() - 0.5) * 0.6) / N;
			cx = Math.min(1 - dx, Math.max(dx, cx));
			const cy = 0.5 + (rand() - 0.5) * 0.05;
			const x0 = cx - dx, x1 = cx + dx, y0 = cy + dy, y1 = cy - dy; // up and to the right
			const bend = (rand() - 0.5) * 0.1;
			const jitter = (rand() - 0.5) * 0.03;
			dabs.push({
				pts: [
					fit(x0, y0),
					fit(x0 + (x1 - x0) * 0.33 + bend / aspect, y0 + (y1 - y0) * 0.33),
					fit(x0 + (x1 - x0) * 0.66 + bend / aspect, y0 + (y1 - y0) * 0.66),
					fit(x1, y1),
				],
				width: 0.17 + rand() * 0.08,
				colors,
				range: [clamp01(x0 + jitter), clamp01(x1 + jitter)],
				seed: seed * 31 + pass * 997 + i,
				dry: 0.55 + rand() * 0.4,
				bristles: 36,
				tone: (rand() - 0.5) * 0.07,
				opacity: 0.9,
			});
		}
	}
	for (let i = dabs.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[dabs[i], dabs[j]] = [dabs[j], dabs[i]];
	}
	return dabs;
}

function render(root: ParentNode = document) {
	for (const cv of root.querySelectorAll<HTMLCanvasElement>('canvas[data-strokes], canvas[data-mix]')) {
		const r = cv.getBoundingClientRect();
		if (!r.width) continue; // hidden: painted when shown (paintWithin)
		if (cv.dataset.paintedW === String(Math.round(r.width))) continue;
		cv.dataset.paintedW = String(Math.round(r.width));
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		cv.width = Math.round(r.width * dpr);
		cv.height = Math.round(r.height * dpr);
		const ctx = cv.getContext('2d')!;
		ctx.scale(dpr, dpr);
		let strokes: PaintStroke[];
		if (cv.dataset.mix) {
			const { colors, seed } = JSON.parse(cv.dataset.mix) as { colors: string[]; seed: number };
			strokes = mixStrokes(colors, seed, r.width / r.height);
		} else {
			strokes = JSON.parse(cv.dataset.strokes!) as PaintStroke[];
		}
		for (const s of strokes) paint(ctx, r.width, r.height, s);
	}
}

/** Paint canvases inside an element that has just been shown. */
export function paintWithin(el: ParentNode) {
	render(el);
}

let started = false;
export function paintAll() {
	if (started) return;
	started = true;
	render();
	let timer: number | undefined;
	let lastW = innerWidth;
	addEventListener('resize', () => {
		if (innerWidth === lastW) return;
		lastW = innerWidth;
		clearTimeout(timer);
		timer = window.setTimeout(() => render(), 150);
	});
}
