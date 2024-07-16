<script context="module" lang="ts">
	const icons = {
		info: 'info',
		sun: 'sun',
		moon: 'moon'
	} as const;

	export type IconType = keyof typeof icons;
</script>

<script lang="ts">
	import { Icon } from '$components';

	export let iconName: IconType;
	export let buttonClass = '';
	export let iconClass = '';
	export let width = '24px';
	export let height = '24px';
	export let clickHandler: (() => void) | null = null;

	const handleClick = () => {
		if (clickHandler) {
			clickHandler();
		}
	};
</script>

<button class={`grow-on-hover bg-transparent p-0 ${buttonClass}`} on:click={handleClick}>
	<Icon {iconName} key={Math.random()} class={iconClass} {width} {height} />
</button>

<style>
	.grow-on-hover {
		transition: transform 0.3s ease;
	}

	.grow-on-hover:hover {
		transform: scale(1.2);
	}
</style>
