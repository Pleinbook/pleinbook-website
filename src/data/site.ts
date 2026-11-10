// Where Pleinbook is on the App Store. Change `status` (and set `url`) here and every App Store
// button on the site follows: the hero button, the top-right corner button and the closing section.
//
//   'soon'      no store page yet: buttons scroll to the closing section
//   'preorder'  the App Store page is up for pre-orders: buttons open it
//   'live'      released
export const appStore = {
	status: 'soon' as 'soon' | 'preorder' | 'live',
	/** The app's App Store URL, e.g. https://apps.apple.com/app/id0000000000 (needed for preorder and live). */
	url: '',
};

const copy = {
	soon: {
		button: 'Coming soon',
		corner: 'Coming soon',
		label: 'Coming soon to the App Store',
		heading: 'Coming soon to iPad.',
		body: 'Pleinbook is in testing now and coming to the App Store soon.',
	},
	preorder: {
		button: 'Pre-order on the App Store',
		corner: 'Pre-order',
		label: 'Pre-order Pleinbook on the App Store',
		heading: 'Coming soon to iPad.',
		body: 'Pre-order now and Pleinbook downloads to your iPad on launch day. It’s free, and Apple lets you know when it arrives.',
	},
	live: {
		button: 'Download on the App Store',
		corner: 'Download',
		label: 'Download Pleinbook on the App Store',
		heading: 'Paint something today.',
		body: 'Pleinbook is free on the App Store for iPad.',
	},
} as const;

export function appStoreLink() {
	const external = appStore.status !== 'soon' && appStore.url !== '';
	return {
		...copy[appStore.status],
		href: external ? appStore.url : '#get',
		external,
	};
}
