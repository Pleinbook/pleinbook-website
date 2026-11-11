import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),

	// One Markdown file per app release, in src/changelog/ (see README › Changelog).
	changelog: defineCollection({
		loader: glob({ pattern: '*.md', base: './src/changelog' }),
		schema: z.object({
			/** The App Store version, e.g. "1.0.0". */
			version: z.string(),
			/** Release date (when it went live on the App Store). */
			date: z.coerce.date(),
			/** One or two sentences: the headline of the release, also usable in the App Store's "What's New". */
			summary: z.string(),
			/** The brush engine version, when this release changes it (replays of older pages may differ). */
			engine: z.number().int().optional(),
			/** Drafts show in `npm run dev` only, and never count towards showing the Changelog links. */
			draft: z.boolean().default(false),
		}),
	}),
};
