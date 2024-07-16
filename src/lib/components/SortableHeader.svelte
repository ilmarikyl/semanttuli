<script lang="ts">
	export let label: string;
	export let column: string;
	export let sortBy: string;
	export let sortOrder: 'asc' | 'desc';
	export let setSortOrder: (column: string) => void;
	export let extraClasses: string = '';

	function getSortIcon() {
		return sortBy === column ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : '';
	}
</script>

<th
	class={`cursor-pointer text-left transition-colors hover:bg-guess-table-header-bg-hover-light dark:hover:bg-guess-table-header-bg-hover-dark ${extraClasses}`}
	on:click={() => setSortOrder(column)}
>
	{label}
	<span class="text-xs">{getSortIcon()}</span>
</th>
