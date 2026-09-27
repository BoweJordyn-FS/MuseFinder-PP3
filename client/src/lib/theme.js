import { createTheme } from '@mantine/core';

// site palette, so mantine components match the rest of the app
const SURFACE = '#10100E';
const RAISED = '#1a1a1a';
const BORDER = 'rgba(217, 217, 217, 0.19)';
const ACCENT = '#925FF0';
const DANGER = '#D64751';

// mantine wants 10 shades, ours sits at index 6 (the default primaryShade)
const violet = [
	'#f3edff',
	'#e9dffc',
	'#d0bcf7',
	'#b697f2',
	'#a077ed',
	'#9765f1',
	ACCENT,
	'#7d4ed4',
	'#6e3fc4',
	'#5e3a9e',
];

// our delete red, so confirm buttons match the trash icons
const red = [
	'#ffeaec',
	'#fdd3d6',
	'#f4a5ab',
	'#ec747d',
	'#e54c57',
	'#e2333f',
	DANGER,
	'#c03b44',
	'#ab333b',
	'#962931',
];

const panel = {
	backgroundColor: RAISED,
	border: `1px solid ${BORDER}`,
	color: 'white',
};

export const theme = createTheme({
	primaryColor: 'violet',
	colors: { violet, red },
	components: {
		// tailwind's preflight resets button backgrounds and beats mantine's
		// stylesheet, so re-apply mantine's own variable inline
		Button: {
			styles: { root: { backgroundColor: 'var(--button-bg)' } },
		},
		Menu: {
			defaultProps: { shadow: 'md', radius: 'md' },
			styles: {
				dropdown: panel,
				item: { color: 'white' },
				divider: { borderColor: BORDER },
			},
		},
		Popover: {
			defaultProps: { radius: 'md' },
			styles: { dropdown: panel },
		},
		Modal: {
			defaultProps: { centered: true, radius: 'lg' },
			styles: {
				header: { backgroundColor: SURFACE },
				body: { backgroundColor: SURFACE },
				content: {
					backgroundColor: SURFACE,
					border: `1px solid ${BORDER}`,
				},
				title: { color: 'white', fontWeight: 600 },
				close: { color: 'white' },
			},
		},
	},
});

// confirm/alert modals opened through modals.openConfirmModal
export const modalProps = { centered: true, radius: 'lg' };
