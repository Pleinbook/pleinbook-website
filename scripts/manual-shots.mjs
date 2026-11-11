// Turns the app's manual screenshots into the manual's images (src/assets/manual/*.webp).
//
// The screenshots come from the app repo's UITests/ManualScreenshotTests.swift, run on the iPad mini
// (A17 Pro) simulator in portrait, which writes PNGs (1488 × 2266) to $TEST_RUNNER_PB_MANUAL_SHOTS.
// See README.md › Manual screenshots. Then:
//
//     node scripts/manual-shots.mjs /path/to/shots            # every image whose source PNG is there
//     node scripts/manual-shots.mjs /path/to/shots kit-ring   # only images whose name contains this
//
// Crop boxes are in the PNG's pixels and assume the iPad mini layout. If a screen's layout changes,
// check the crop (open the WebP) and adjust its box here.

import sharp from 'sharp';
import { existsSync } from 'node:fs';
import path from 'node:path';

const OUT = 'src/assets/manual';
const SIZE = { width: 1488, height: 2266 }; // iPad mini (A17 Pro), portrait, @2x

// Whole screens, scaled to 1000 px wide.
const whole = (name, from = name) => ({ name, from, width: 1000, quality: 86 });
// A crop at full resolution (shown at half size, the iPad's own points), or scaled to `width`.
const crop = (name, from, [left, top, width, height], opts = {}) => ({
	name,
	from,
	box: { left, top, width, height },
	quality: 88,
	...opts,
});

const RECIPES = [
	// Getting started
	whole('getting-started-drawing-screen'),
	crop('getting-started-top-bar', 'getting-started-drawing-screen-easy', [0, 0, 1110, 146], { quality: 90 }),
	crop('getting-started-tool-rail', 'getting-started-drawing-screen-easy', [1349, 830, 139, 570], { quality: 90 }),
	// Painting: the paper sheet, and yellow over blue with a Dry, a Wet and a Lasso brush
	crop('painting-paper', 'painting-paper', [139, 449, 1210, 1368], { width: 1000, quality: 86 }),
	crop('painting-dry', 'painting-brushes', [58, 714, 420, 480]),
	crop('painting-wet', 'painting-brushes', [475, 714, 420, 480]),
	crop('painting-lasso', 'painting-brushes', [891, 714, 420, 480]),
	// Colour
	whole('colour-panel-wheel'),
	whole('colour-scratchpad'),
	whole('colour-swatches'),
	// Brushes and kits
	whole('brushes-library'),
	crop('brushes-kit-ring', 'brushes-kit-ring-dark', [314, 740, 860, 860]),
	whole('brushes-editor'),
	whole('brushes-editor-curve'),
	// Seeing your work
	whole('seeing-value-check'),
	whole('seeing-guides'),
	whole('seeing-adjustments-levels'),
	// Sketchbooks. The page menu scrolls on iPad mini, hiding its last items; testPageMenu shoots it
	// whole on the 13-inch iPad Pro instead, which needs its own crop box.
	whole('sketchbooks-new-sketchbook'),
	crop('sketchbooks-page-menu', 'sketchbooks-page-menu', [16, 176, 500, 1530]),
	// Import and export
	crop('import-image', 'import-image', [139, 449, 1210, 1368], { width: 1000, quality: 86 }),
	// Pleinbook Unlock
	whole('unlock-sheet'),
	crop('unlock-premium-covers', 'unlock-premium-covers', [320, 880, 848, 524]),
	crop('unlock-premium-papers', 'unlock-premium-papers', [320, 930, 848, 462]),
	// Settings
	whole('settings-1'),
	whole('settings-pencil-pressure'),
];

const [shots, filter] = process.argv.slice(2);
if (!shots) {
	console.error('Usage: node scripts/manual-shots.mjs <shots folder> [name filter]');
	process.exit(1);
}

let made = 0;
for (const r of RECIPES.filter((r) => !filter || r.name.includes(filter))) {
	const src = path.join(shots, `${r.from}.png`);
	if (!existsSync(src)) {
		console.log(`skip  ${r.name} (no ${r.from}.png)`);
		continue;
	}
	const meta = await sharp(src).metadata();
	if (r.box && (meta.width !== SIZE.width || meta.height !== SIZE.height)) {
		console.warn(`warn  ${r.from}.png is ${meta.width}×${meta.height}, not the iPad mini's ${SIZE.width}×${SIZE.height}: check the crop`);
	}
	let img = sharp(src);
	if (r.box) img = img.extract(r.box);
	if (r.width) img = img.resize({ width: r.width });
	const out = path.join(OUT, `${r.name}.webp`);
	const info = await img.webp({ quality: r.quality }).toFile(out);
	console.log(`made  ${out}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
	made++;
}
console.log(`${made} image(s) written.`);
