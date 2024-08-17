<script lang="ts">
	import { slide, fly } from 'svelte/transition';
	import { gameState, toggleGameInfoCollapsed } from '$stores/gameState';
	import { Spinner } from '$components';
	import type { SimilarityData } from '$lib/types';

	$: gameNumber = $gameState.gameNumber;
	$: similarityData = $gameState.similarityData;
	$: isGameInfoCollapsed = $gameState.isGameInfoCollapsed;

	const similarityKeys: (keyof SimilarityData)[] = ['top', 'top10', 'top1000'];

	const similarityLabels = {
		top: 'Lähin',
		top10: '10. lähin',
		top1000: '1000. lähin'
	};
</script>

<div class="rounded-lg p-3 py-3 sm:p-3 sm:py-4">
	<div class="mb-0 flex w-full flex-row items-center justify-between sm:mb-4">
		<div class="flex flex-row items-end gap-1 font-Concert text-base sm:text-xl">
			<span>PELI:</span>
			<div class="flex h-10 items-end">
				{#if gameNumber !== -1}
					<span class="text-3xl sm:text-4xl">#{gameNumber}</span>
				{/if}
			</div>
		</div>

		{#if $gameState.winState === 'playing'}
			<button
				class="mb-2 flex w-auto items-center justify-between p-2 transition-transform duration-300 ease-in-out"
				on:click={() => toggleGameInfoCollapsed(!isGameInfoCollapsed)}
			>
				<svg
					class="h-8 w-8 transform text-[#7F7C82] transition-transform duration-300 ease-in-out"
					class:rotate-180={!isGameInfoCollapsed}
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="6 9 12 15 18 9"></polyline>
				</svg>
			</button>
		{/if}
	</div>
	{#if !isGameInfoCollapsed}
		<div transition:slide={{ duration: 300 }} class="mt-4">
			<p class="mb-4 text-center text-xs sm:text-sm">
				Mitä korkeammat pisteet, sitä lähempänä arvaus on salaista sanaa.
			</p>
			<div class="flex items-center justify-between border-gray-300 dark:border-gray-700">
				{#each similarityKeys as key}
					<div
						class="flex-1 px-1 py-2 text-center sm:px-2 {key !== 'top1000'
							? 'border-r-2 border-gray-300 dark:border-gray-700'
							: ''}"
					>
						<span class="block text-xs font-semibold text-gray-600 dark:text-gray-400 sm:text-base"
							>{similarityLabels[key]}</span
						>
						<span class="mt-1 block text-sm font-bold sm:text-lg">
							{#if similarityData[key] === null}
								<Spinner size="1" />
							{:else}
								<span class="text-highlight-light dark:text-highlight-dark"
									>{similarityData[key]?.toFixed(2)}</span
								>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
