// Colour ladders from the app repo's docs/mixing/ladders.png: the "sRGB lerp (digital)" rows and the
// "engine v7 (shipping)" rows, sampled cell by cell. Re-sample if the mixing engine changes.
export interface Mix {
	id: string;
	label: string;
	from: string;
	to: string;
	digital: string[];
	pleinbook: string[];
}

export const mixes: Mix[] = [
	{
		id: 'yellow-blue',
		label: 'Yellow + blue',
		from: 'Yellow',
		to: 'Blue',
		digital: ['#ffd700', '#ebcb00', '#d6be00', '#c0b339', '#aba656', '#95996e', '#818c84', '#6b8198', '#5474ac', '#3d67c0', '#245ad3'],
		pleinbook: ['#ffd700', '#c7cd00', '#aec300', '#9aba00', '#89b01d', '#78a730', '#679d3e', '#56934c', '#41875d', '#2a7976', '#245ad3'],
	},
	{
		id: 'lemon-cyan',
		label: 'Lemon + cyan',
		from: 'Lemon',
		to: 'Cyan',
		digital: ['#fff100', '#e4e900', '#c7e12e', '#a8d850', '#89d169', '#66c87f', '#3ec093', '#00b7a7', '#00aeba', '#00a5cc', '#009cdf'],
		pleinbook: ['#fff100', '#bce900', '#9ee300', '#87dc0c', '#72d528', '#5bd037', '#41c945', '#19c153', '#00b964', '#00af7f', '#009cdf'],
	},
	{
		id: 'red-ultramarine',
		label: 'Red + ultramarine',
		from: 'Red',
		to: 'Ultramarine',
		digital: ['#ed0000', '#d8001e', '#c30037', '#ad0f4a', '#991a5e', '#84216f', '#6e2681', '#592b93', '#432ea4', '#2c31b6', '#1034c7'],
		pleinbook: ['#ed0000', '#aa0017', '#8f0622', '#7d0e2a', '#6d1333', '#60193b', '#531f45', '#472450', '#3a2b61', '#2b327c', '#1034c7'],
	},
	{
		id: 'yellow-red',
		label: 'Yellow + red',
		from: 'Yellow',
		to: 'Red',
		digital: ['#ffd700', '#ffc400', '#feb100', '#fe9d00', '#fc8800', '#fa7400', '#f85f00', '#f64800', '#f23000', '#f00600', '#ed0000'],
		pleinbook: ['#ffd700', '#ffad00', '#ff9500', '#ff8200', '#fe7200', '#fc6200', '#fa5300', '#f74300', '#f52f00', '#f11100', '#ed0000'],
	},
	{
		id: 'red-white',
		label: 'Red + white',
		from: 'Red',
		to: 'White',
		digital: ['#ed0000', '#f11421', '#f33a3f', '#f65758', '#f97071', '#fb8989', '#fda1a1', '#feb9b8', '#fed0d0', '#ffe8e8', '#ffffff'],
		pleinbook: ['#ed0000', '#f21826', '#f5353c', '#f9474d', '#fd585e', '#ff676d', '#ff777d', '#ff898d', '#ff9da1', '#ffb7bb', '#ffffff'],
	},
	{
		id: 'yellow-violet',
		label: 'Yellow + violet',
		from: 'Yellow',
		to: 'Violet',
		digital: ['#ffd700', '#f6c500', '#e9b300', '#dea020', '#d38e3e', '#c87d51', '#bb6a63', '#af5773', '#a44483', '#983190', '#8b1b9e'],
		pleinbook: ['#ffd700', '#ebbe00', '#e0ac00', '#d79d00', '#cd8f17', '#c5822c', '#bb7538', '#b16646', '#a55855', '#984568', '#8b1b9e'],
	},
	{
		id: 'red-cyan',
		label: 'Red + cyan',
		from: 'Red',
		to: 'Cyan',
		digital: ['#ed0000', '#d50822', '#bc293c', '#a43c52', '#8a4d67', '#6f5b7b', '#53698f', '#2c76a3', '#0083b8', '#0090cb', '#009cdf'],
		pleinbook: ['#ed0000', '#9a1e1c', '#812929', '#713133', '#65393e', '#594149', '#4c4b55', '#3e5663', '#296477', '#007894', '#009cdf'],
	},
	{
		id: 'black-yellow',
		label: 'Black + yellow',
		from: 'Black',
		to: 'Yellow',
		digital: ['#000000', '#1a1601', '#332b00', '#4d4100', '#675600', '#806b00', '#9a8100', '#b49700', '#cdac00', '#e7c200', '#ffd700'],
		pleinbook: ['#000000', '#313110', '#484813', '#5a5a10', '#6a6a06', '#797900', '#898800', '#999800', '#ada800', '#c6bc00', '#ffd700'],
	},
];
