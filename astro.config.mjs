// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Static output only: Cloudflare Pages serves the `dist/` folder as-is.
// Build command `npm run build`, output directory `dist`.

export default defineConfig({
	site: 'https://pleinbook.com',
	integrations: [
		starlight({
			title: 'Pleinbook',
			description: 'A pigment-mixing digital sketchbook: one layer, no undo.',
			logo: { src: './src/assets/brushmark.svg', alt: '' },
			// Same share image, home-screen icon and favicon fallback as the homepage.
			head: [
				{ tag: 'link', attrs: { rel: 'preload', href: '/fonts/fraunces-600-normal.woff2', as: 'font', type: 'font/woff2', crossorigin: '' } },
				{ tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '48x48' } },
				{ tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
				{ tag: 'meta', attrs: { property: 'og:image', content: 'https://pleinbook.com/og.jpg' } },
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{ tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
			],
			customCss: ['./src/styles/theme.css', './src/styles/starlight.css'],
			components: {
				Footer: './src/components/Footer.astro',
				Header: './src/components/ManualHeader.astro',
				Sidebar: './src/components/ManualSidebar.astro',
				ThemeProvider: './src/components/ThemeProvider.astro',
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
			},
			social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/ZaW9Auzgbg' }],
			// The left panel is ManualSidebar.astro (pages with their sections). This config only sets the
			// page order for Previous/Next links: one group of every page in src/content/docs/docs/.
			sidebar: [{ label: 'Manual', items: [{ autogenerate: { directory: 'docs' } }] }],
			// Sections are listed in the left panel, so no separate "On this page" column.
			tableOfContents: false,
			// Search: the manual's pages are long on purpose (sections, not one page per topic), so don't rank
			// long pages lower. Results still point at the matching section.
			pagefind: { ranking: { pageLength: 0 } },
		}),
	],
});
