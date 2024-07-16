<script lang="ts">
	import { decodeB64word } from '$lib/utils/utils';
	import { gameState, updateGuesses, setSortOrder } from '$stores/gameState';
	import { NotificationBanner } from '$lib/components';
	import { tick } from 'svelte';
	import { processGuess } from '$lib/utils/gameLogic';

	export let secretWord: string;

	let guess: string = '';
	let errorMessage: string;
	let timeoutId: NodeJS.Timeout | number; // Correct type for timeout ID
	let isPending: boolean = false;
	let inputElement: HTMLInputElement | null = null; // Reference to the input element

	$: secretWordVec = $gameState.secretWordVec;
	$: guesses = $gameState.guesses;
	$: sortOrder = $gameState.sortOrder;
	$: sortBy = $gameState.sortBy;
	$: winState = $gameState.winState;

	function displayErrorMessage() {
		timeoutId = setTimeout(() => {
			errorMessage = '';
		}, 3000);
	}

	async function handleGuess(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		clearTimeout(timeoutId as number);
		errorMessage = '';

		if (guess.trim().length < 3) {
			errorMessage = 'Arvauksessa pitää olla vähintään 3 kirjainta';
			displayErrorMessage();
			return;
		}

		isPending = true;

		// If guess is already in the guess array, just update the latest guess
		const isAlreadyGuessed = guesses.some((g) => g.word === guess);

		if (isAlreadyGuessed) {
			const guessData = guesses.find((g) => g.word === guess);
			if (guessData) {
				updateGuesses({
					guessNumber: guessData.guessNumber,
					word: guess,
					similarityScore: guessData.similarityScore,
					rank: guessData.rank,
					wasHinted: guessData.wasHinted,
					isNew: false,
					addToGuesses: false
				});
			}

			// After each guess, make sure the sort order is set to 'similarityScore (desc)'
			if (sortBy !== 'similarityScore' || sortOrder !== 'desc') {
				setSortOrder('similarityScore');
			}

			isPending = false;
			guess = '';

			await tick(); // Wait for the DOM to update
			if (inputElement) inputElement.focus(); // Keep the input focused
			return;
		}

		const result = await processGuess(guess, secretWord, secretWordVec, winState);

		if (result.error) {
			errorMessage = result.error;
			displayErrorMessage();
		} else if (result.success) {
			if (window.scrollY > 125) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}

		isPending = false;
		guess = '';
		await tick(); // Wait for the DOM to update
		if (inputElement) inputElement.focus(); // Keep the input focused
	}
</script>

<NotificationBanner {isPending} {errorMessage} />

<form on:submit={handleGuess} autocorrect="off" autocapitalize="none" autocomplete="off">
	<div class="width-100 mx-0 my-2 flex items-center text-sm sm:my-6 sm:text-base">
		<input
			bind:this={inputElement}
			placeholder="Arvaa sana"
			bind:value={guess}
			type="text"
			autocorrect="off"
			autocapitalize="none"
			autocomplete="off"
			disabled={isPending}
			class="flex-grow rounded-l-3xl bg-input-bg-light p-3 pl-6 placeholder:text-gray-400 focus:outline-none disabled:cursor-wait disabled:bg-white disabled:text-gray-400 dark:bg-input-bg-dark dark:placeholder:text-gray-200"
		/>
		<button
			type="submit"
			class="duration-250 w-24 rounded-r-3xl bg-submit-btn-bg-light py-3 text-white transition-colors ease-in-out hover:bg-submit-btn-bg-hover-light dark:bg-submit-btn-bg-dark hover:dark:bg-submit-btn-bg-hover-dark sm:w-32"
			disabled={isPending}
		>
			Arvaa
		</button>
	</div>
</form>
