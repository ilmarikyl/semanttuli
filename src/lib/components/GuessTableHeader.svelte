<script lang="ts">
	import { _ } from 'svelte-i18n';
	import SortableHeader from './SortableHeader.svelte';
	import TooltipHeader from './TooltipHeader.svelte';

	export let setSortOrder: (column: string) => void;
	export let sortBy: string;
	export let sortOrder: 'asc' | 'desc';
</script>

<thead class="font-Nunito">
	{#key `${sortBy}-${sortOrder}`}
		<tr class="bg-guess-table-header-bg-light dark:bg-guess-table-header-bg-dark">
			<SortableHeader
				label="#"
				column="guessNumber"
				{sortBy}
				{sortOrder}
				{setSortOrder}
				extraClasses="pl-2 sm:pl-12 rounded-tl-2xl py-[0.5rem] sm:rounded-tl-3xl"
			/>
			<SortableHeader
				label={$_('guessTable.word')}
				column="word"
				{sortBy}
				{sortOrder}
				{setSortOrder}
				extraClasses="pl-0 sm:pl-8"
			/>
			<SortableHeader
				label={$_('guessTable.score')}
				column="similarityScore"
				{sortBy}
				{sortOrder}
				{setSortOrder}
				extraClasses="pl-2 sm:pl-8"
			/>
			<TooltipHeader
				label={$_('guessTable.gettingWarm')}
				tooltip={$_('guessTable.gettingWarmTooltip')}
				extraClasses="rounded-tr-3xl"
			/>
		</tr>
	{/key}
</thead>
