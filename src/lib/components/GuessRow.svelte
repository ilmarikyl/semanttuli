<script lang="ts">
	import { fade } from 'svelte/transition';
	import { ProgressBar, Tooltip } from '$components';
	import type { Guess } from '$lib/types';
	import { getSimilarityColor } from '$lib/utils/utils';

	export let guess: Guess;
	export let darkMode: boolean;
	export let isLatest: boolean = false;
	export let winState: string = '';
	export let similarityData: { top: number | null; top10: number | null; top1000: number | null };
	export let isInGuessesArray: boolean;

	const getGuessNumber = () => {
		// TODO: Write something cleaner
		if (
			isLatest &&
			winState !== 'playing' &&
			guess.similarityScore < 99.9999 &&
			!isInGuessesArray
		) {
			return '-';
		}

		return guess.guessNumber;
	};

	$: fadeDuration = isLatest && guess.isNew ? 1250 : 0;
</script>

<tr class={isLatest ? 'h-10 sm:h-14' : ''}>
	{#key `${guess.word}-${darkMode}`}
		<td
			in:fade={{ duration: fadeDuration }}
			class={`w-10 pl-2 sm:w-24 sm:pl-12 ${isLatest ? 'py-0' : 'py-[0.15rem] sm:py-1'}`}
		>
			{getGuessNumber()}
		</td>
		<td in:fade={{ duration: fadeDuration }} class="w-[150px] max-w-[150px] pl-0 sm:w-[260px] sm:max-w-[260px] sm:pl-8">
			<div class="flex items-center">
				<span class="truncate">{guess.word}</span>
				{#if guess.wasHinted}
					<svg
						style="height: 1em"
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 text-yellow-400 dark:text-yellow-500"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
							clip-rule="evenodd"
						/>
					</svg>
				{/if}
			</div>
		</td>
		<td
			in:fade={{ duration: fadeDuration }}
			class="w-[70px] pl-2 font-semibold sm:w-32 sm:pl-8"
			style="color: {getSimilarityColor(guess.similarityScore, darkMode)};"
		>
			{guess.similarityScore.toFixed(2)}
		</td>
	{/key}
	<td class="px-1 pl-2 font-normal sm:px-4" style="text-align: center;">
		{#if guess.rank == 1000}
			<div class="flex justify-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="checkmark-icon h-6 w-6 text-green-400 dark:text-green-600"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>
		{:else if guess.rank > 0}
			{#key `${guess.guessNumber}-${guess.rank}`}
				<ProgressBar rank={guess.rank} animate={isLatest && guess.isNew} />
			{/key}
		{:else if similarityData.top1000 && guess.similarityScore > similarityData.top1000}
			<Tooltip
				title="Harvinainen sana löytyi! Tämä sana on tuhannen samankaltaisimman joukossa, mutta sen tarkka sijoitus ei jostain syystä ole tiedossa."
			>
				❓
			</Tooltip>
		{:else}
			{#key guess.word}
				<span in:fade={{ duration: fadeDuration }}>❄️</span>
			{/key}
		{/if}
	</td>
</tr>

<style>
	.checkmark-icon {
		animation-duration: 1.5s;
		animation-iteration-count: infinite;
		animation-name: pulse;
	}

	@keyframes pulse {
		0% {
			transform: scale(1, 1);
		}
		50% {
			transform: scale(1.2, 1.2);
		}
		100% {
			transform: scale(1, 1);
		}
	}
</style>
