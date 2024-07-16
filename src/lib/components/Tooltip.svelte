<script lang="ts">
	export let title: string = '';
	let isHovered: boolean = false;
	let x: number = 0;
	let y: number = 0;

	function handleMouseOver(event: MouseEvent): void {
		isHovered = true;
		x = event.pageX - 160;
		y = event.pageY - 95;
	}

	function handleMouseMove(event: MouseEvent): void {
		x = event.pageX - 160;
		y = event.pageY - 95;
	}

	function handleMouseLeave(): void {
		isHovered = false;
	}

	function handleFocus(event: FocusEvent): void {
		isHovered = true;
		const target = event.target as HTMLElement;
		const rect = target.getBoundingClientRect();
		x = rect.left + window.scrollX + target.offsetWidth / 2;
		y = rect.top + window.scrollY + target.offsetHeight + 5;
	}

	function handleBlur(): void {
		isHovered = false;
	}
</script>

<div
	role="tooltip"
	tabindex="-1"
	on:mouseover={handleMouseOver}
	on:mouseleave={handleMouseLeave}
	on:mousemove={handleMouseMove}
	on:focus={handleFocus}
	on:blur={handleBlur}
	class="relative"
>
	<slot />
</div>

{#if isHovered}
	<div
		class="absolute z-20 max-w-xs rounded border border-gray-300 bg-white p-2 text-sm font-normal text-black shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		style="top: {y}px; left: {x}px;"
	>
		{title}
	</div>
{/if}
