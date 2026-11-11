// Releases for the changelog page, its feed and the Changelog links.
import { getCollection, type CollectionEntry } from 'astro:content';

export type Release = CollectionEntry<'changelog'>;

const newestFirst = (a: Release, b: Release) => b.data.date.getTime() - a.data.date.getTime();

/** Published releases, newest first. Drafts never count, in dev or production. */
export async function publishedReleases(): Promise<Release[]> {
	return (await getCollection('changelog', (e) => !e.data.draft)).sort(newestFirst);
}

/** What the changelog page shows: published releases, plus drafts while running `npm run dev`. */
export async function visibleReleases(): Promise<Release[]> {
	return (await getCollection('changelog', (e) => import.meta.env.DEV || !e.data.draft)).sort(newestFirst);
}

/** The anchor for a release on the changelog page, e.g. "1.0.0". */
export const releaseId = (r: Release) => r.data.version;
