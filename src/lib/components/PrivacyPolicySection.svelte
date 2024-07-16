<script lang="ts">
	export let title: string;
	export let content: string;
</script>

<div class="mb-4 text-base">
	{#if title}
		<h3 class="mb-2 mt-6 text-xl font-semibold">{title}</h3>
	{/if}
	<p>{content}</p>
</div>
