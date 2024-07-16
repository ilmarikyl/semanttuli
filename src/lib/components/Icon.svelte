<!-- src/lib/Icon.svelte -->
<script lang="ts">
	export let iconName: 'info' | 'sun' | 'moon';
	export let width = '1rem';
	export let height = '1rem';
	export let focusable: string | number | null | undefined = undefined;

	const icons = {
		info: {
			box: 18,
			svg: '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>'
		},
		sun: {
			box: 18,
			svg: '<path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>'
		},
		moon: {
			box: 18,
			svg: '<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />'
		}
	} as const;

	$: displayIcon = icons[iconName];
</script>

<svg
	class={$$props.class}
	fill="currentColor"
	{focusable}
	{width}
	{height}
	viewBox="0 0 {displayIcon.box} {displayIcon.box}"
>
	{@html displayIcon.svg}
</svg>
