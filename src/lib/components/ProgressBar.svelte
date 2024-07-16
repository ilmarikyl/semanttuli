<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { isDarkMode } from '$stores/theme';

	export let rank: number;
	export let animate: boolean = true;

	let width = 0;
	let color = 'rgb(128, 192, 255)'; // Initial color (blue)

	// Define colors for light and dark themes
	const lightStartColor: [number, number, number] = [193, 210, 255];
	const lightEndColor: [number, number, number] = [255, 193, 193];
	const darkStartColor: [number, number, number] = [3, 99, 209];
	const darkEndColor: [number, number, number] = [150, 0, 0];

	let startColor: [number, number, number] = lightStartColor;
	let endColor: [number, number, number] = lightEndColor;

	$: darkMode = $isDarkMode;

	// Update start and end colors based on the theme
	$: {
		if (darkMode) {
			startColor = darkStartColor;
			endColor = darkEndColor;
		} else {
			startColor = lightStartColor;
			endColor = lightEndColor;
		}
		color = interpolateColor(startColor, endColor, width / 100); // Update the color when the theme changes
	}

	function interpolateColor(
		startColor: [number, number, number],
		endColor: [number, number, number],
		factor: number
	): string {
		const result = startColor.slice();
		for (let i = 0; i < 3; i++) {
			result[i] = Math.round(result[i] + factor * (endColor[i] - result[i]));
		}
		return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
	}

	function animateBar() {
		let startTime: number | null = null;

		function step(timestamp: number) {
			if (!startTime) startTime = timestamp;
			const progress = Math.min((timestamp - startTime) / 1250, 1); // 1250ms animation duration
			width = progress * (rank / 1000) * 100;
			color = interpolateColor(startColor, endColor, progress); // Adjust color based on progress
			if (progress < 1) {
				requestAnimationFrame(step);
			}
		}

		requestAnimationFrame(step);
	}

	onMount(() => {
		if (animate) {
			width = 0; // Initial width
			setTimeout(() => {
				animateBar();
			}, 500); // Delay for animation to start
		} else {
			width = (rank / 1000) * 100;
			color = interpolateColor(startColor, endColor, rank / 1000);
		}
	});
</script>

<div class="relative h-5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-500 sm:h-6">
	<div
		class="absolute left-0 top-0 h-full"
		style="width: {width}%; background-color: {color};"
	></div>
	<div
		in:fade={{ duration: animate ? 2250 : 0 }}
		class="absolute inset-0 flex items-center justify-center text-sm"
	>
		{rank}/1000
	</div>
</div>
