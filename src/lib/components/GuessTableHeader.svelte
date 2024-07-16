<script lang="ts">
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
				label="Arvaus"
				column="word"
				{sortBy}
				{sortOrder}
				{setSortOrder}
				extraClasses="pl-0 sm:pl-8"
			/>
			<SortableHeader
				label="Pisteet"
				column="similarityScore"
				{sortBy}
				{sortOrder}
				{setSortOrder}
				extraClasses="pl-2 sm:pl-8"
			/>
			<TooltipHeader
				label="Joko polttaa"
				tooltip="Kun arvaamasi sana on tuhannen lähimmän joukossa, palkki kertoo, kuinka lähellä se on. Mitä suurempi luku/palkki, sitä lähempänä."
				extraClasses="rounded-tr-3xl"
			/>
		</tr>
	{/key}
</thead>
