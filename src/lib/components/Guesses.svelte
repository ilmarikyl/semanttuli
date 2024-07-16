<script lang="ts">
	import { gameState, setSortOrder } from '$stores/gameState';
	import { GuessRow, GuessTableHeader } from '$components';
	import { isDarkMode } from '$stores/theme';
	import { derived } from 'svelte/store';

	const guessData = derived(gameState, ($gameState) => ({
		latestGuess: $gameState.latestGuess,
		sortBy: $gameState.sortBy,
		sortOrder: $gameState.sortOrder,
		similarityData: $gameState.similarityData,
		filteredGuesses: $gameState.guesses.filter(
			(guess) => guess.word !== $gameState.latestGuess?.word
		),
		isInGuessesArray: $gameState.guesses.some(
			(guess) => guess.word === $gameState.latestGuess?.word
		),
		numOfGuesses: $gameState.guesses.length,
		winState: $gameState.winState
	}));

	$: ({
		latestGuess,
		sortBy,
		sortOrder,
		similarityData,
		filteredGuesses,
		isInGuessesArray,
		numOfGuesses,
		winState
	} = $guessData);
	$: darkMode = $isDarkMode;
</script>

{#if numOfGuesses > 0}
	<table class="mt-4 w-full rounded-t-3xl text-sm sm:text-base">
		<GuessTableHeader {setSortOrder} {sortBy} {sortOrder} />
		{#if latestGuess?.word}
			<tbody class="font-medium">
				<GuessRow
					isLatest={true}
					guess={latestGuess}
					{darkMode}
					{winState}
					{similarityData}
					{isInGuessesArray}
				/>
			</tbody>
			{#if numOfGuesses > 1}
				<tr>
					<td
						colspan="4"
						class="border-t-2 border-guess-table-header-bg-light pb-[0.3rem] dark:border-guess-table-header-bg-dark sm:pb-2"
					/>
				</tr>
			{/if}
		{/if}
	</table>
{/if}

{#if filteredGuesses.length > 0}
	<table class="w-full text-sm sm:text-base">
		<tbody>
			{#each filteredGuesses as guess (guess.guessNumber)}
				<GuessRow {guess} {darkMode} {winState} {similarityData} {isInGuessesArray} />
			{/each}
		</tbody>
	</table>
{/if}
