// The manual's pages and their sections, for the left panel (ManualSidebar.astro).
import { getCollection, render } from 'astro:content';

export interface ManualPage {
	id: string;
	href: string;
	title: string;
	badge?: string;
	sections: { slug: string; text: string }[];
}

let cache: Promise<ManualPage[]> | undefined;

/** Manual pages in sidebar order (the manual's front page first), each with its h2 sections. Drafts in dev only. */
export function manualIndex(): Promise<ManualPage[]> {
	// Cached for production builds; rebuilt on every request in dev so edits show straight away.
	if (import.meta.env.DEV) cache = undefined;
	cache ??= (async () => {
		const entries = await getCollection(
			'docs',
			(e) => (e.id === 'docs' || e.id.startsWith('docs/')) && (import.meta.env.DEV || !e.data.draft),
		);
		entries.sort((a, b) => {
			if (a.id === 'docs') return -1;
			if (b.id === 'docs') return 1;
			return (a.data.sidebar?.order ?? 999) - (b.data.sidebar?.order ?? 999);
		});
		return Promise.all(
			entries.map(async (e) => {
				const { headings } = await render(e);
				const badge = e.data.sidebar?.badge;
				return {
					id: e.id,
					href: `/${e.id}/`,
					title: e.id === 'docs' ? "What's here" : e.data.title,
					badge: typeof badge === 'string' ? badge : badge?.text,
					sections: headings.filter((h) => h.depth === 2).map((h) => ({ slug: h.slug, text: h.text })),
				};
			}),
		);
	})();
	return cache;
}
