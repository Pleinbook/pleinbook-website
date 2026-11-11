// RSS feed of published releases, so people can follow updates without giving us an email address.
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { publishedReleases, releaseId } from '../data/changelog';

export async function GET(context: APIContext) {
	const releases = await publishedReleases();
	return rss({
		title: 'Pleinbook changelog',
		description: "What's new in each version of Pleinbook.",
		site: context.site!,
		items: releases.map((r) => ({
			title: `Pleinbook ${r.data.version}`,
			pubDate: r.data.date,
			description: r.data.summary,
			link: `/changelog/#${releaseId(r)}`,
			content:
				`<p>${r.data.summary}</p>` +
				(r.data.engine
					? '<p><strong>Brush engine updated.</strong> Replays of pages painted before this version may look a little different. Your saved paintings aren’t affected.</p>'
					: '') +
				(r.rendered?.html ?? ''),
		})),
	});
}
