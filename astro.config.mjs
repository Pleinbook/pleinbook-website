// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Static output only: Cloudflare Pages serves the `dist/` folder as-is.
// Build command `npm run build`, output directory `dist`.

/** One sidebar group per folder under src/content/docs/docs/. New files appear automatically. */
const section = (label, dir) => ({ label, items: [{ autogenerate: { directory: `docs/${dir}` } }] });

export default defineConfig({
	site: 'https://pleinbook.com',
	integrations: [
		starlight({
			title: 'Pleinbook',
			description: 'A pigment-mixing digital sketchbook: one layer, no undo.',
			logo: { src: './src/assets/brushmark.svg', alt: '' },
			// Same share image, home-screen icon and favicon fallback as the homepage.
			head: [
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
				ThemeProvider: './src/components/ThemeProvider.astro',
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
			},
			social: [{ icon: 'discord', label: 'Discord', href: 'https://discord.gg/ZaW9Auzgbg' }],
			sidebar: [
				{ label: 'Manual', link: '/docs/' },
				section('Getting started', 'getting-started'),
				section('Painting', 'painting'),
				section('Colour', 'colour'),
				section('Brushes', 'brushes'),
				section('Sketchbooks', 'sketchbooks'),
				section('Sync', 'sync'),
				section('Replay', 'replay'),
				section('Reference', 'reference'),
			],
		}),
	],
});
