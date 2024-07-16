/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
	plugins: [require('@tailwindcss/typography')],
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				PurplePurse: ['Purple Purse', 'cursive'],
				Rubik: ['Rubik', 'sans-serif'],
				Nunito: ['Nunito', 'sans-serif'],
				Concert: ['Concert One', 'cursive']
			}
		},
		colors: {
			light: {
				purple: {
					100: '#E1CCEC',
					200: '#C9B6E4',
					300: '#BE9FE1',
					400: '#B38DD9'
				},
				link: '#2563EB',
				'link-hover': '#1D4ED8'
			},
			dark: {
				purple: {
					100: '#201029',
					200: '#351B44',
					300: '#201029',
					400: '#351B44'
				},
				link: '#2563EB'
			},
			
			'text-light': '#555555',
			'text-dark': '#FFFFFF',

			'highlight-light': '#EF9C66',
			'highlight-hover-light': '#EB8B4B',
			'highlight-dark': '#2C74B3',
			'highlight-hover-dark': '#205295',

			'bg-light': '#F1F1F6',
			'bg-dark': '#000000',

			'menu-item-light': '#BE9FE1',
			'menu-item-dark': '#FFFFFF',


			'guess-table-header-bg-light': '#E1CCEC',
			'guess-table-header-bg-dark': '#201029',

			'guess-table-header-bg-hover-light': '#C9B6E4',
			'guess-table-header-bg-hover-dark': '#351B44',

			'submit-btn-bg-light': '#BE9FE1',
			'submit-btn-bg-dark': '#2C74B3',

			'submit-btn-bg-hover-light': '#C9B6E4',
			'submit-btn-bg-hover-dark': '#205295',

			'input-bg-light': '#FFFFFF',
			'input-bg-dark': '#0A2647',

			'btn-bg-primary-light': '#BE9FE1',
			'btn-bg-primary-dark': '#201029',

			'btn-bg-primary-hover-light': '#C9B6E4',
			'btn-bg-primary-hover-dark': '#351B44',

			'btn-bg-secondary-light': '#BFA2DB',
			'btn-bg-secondary-dark': '#351B44',

			'btn-text-secondary-hover-light': '#FFFFFF',
			'btn-text-secondary-hover-dark': '#BFA2DB',

			'modal-bg-light': '#F1F1F6',
			'modal-bg-dark': '#0A2647',

			'accordion-item-bg-light': '#F0D9FF',
			'accordion-item-bg-dark': '#144272',

			'winstate-bg-light': '#E1CCEC',
			'winstate-bg-dark': '#201029',

			'winstate-stats-bg-light': '#C9B6E4',
			'winstate-stats-bg-dark': '#201029',

			transparent: 'transparent',
			current: 'currentColor',
			black: colors.black,
			white: colors.white,
			green: colors.green,
			gray: colors.neutral,
			indigo: colors.indigo,
			red: colors.rose,
			yellow: colors.amber,
			blue: colors.blue,
			purple: colors.purple
		}
	},
	variants: {
		extend: {
			typography: ['dark']
		}
	}
};
