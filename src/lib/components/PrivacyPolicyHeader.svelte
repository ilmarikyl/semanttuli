<script lang="ts">
	export let level: number;
	export let text: string;
</script>

{#if level === 1}
	<h1 class="my-4 text-2xl font-bold">{text}</h1>
{:else if level === 2}
	<h2 class="my-4 text-2xl font-semibold">{text}</h2>
{:else}
	<h3 class="my-4 text-lg font-medium">{text}</h3>
{/if}
