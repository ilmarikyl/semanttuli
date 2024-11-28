<!-- src/lib/Accordion.svelte -->
<script lang="ts">
	import { AccordionItem } from '$components';

	export let items: Array<{ title: string; content: string }>;
</script>

<div class="space-y-1 text-sm sm:text-base">
	{#each items as { title, content }}
		<AccordionItem {title} {content} />
	{/each}
</div>



