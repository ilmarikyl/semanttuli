<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { gameState, updateGuesses, setSortOrder } from '$stores/gameState';
	import { NotificationBanner } from '$lib/components';
	import { processGuess } from '$lib/utils/gameLogic';

	export let secretWord: string;

	let guess: string = '';
	let errorMessage: string;
	let isPending: boolean = false;
	let inputElement: HTMLInputElement;
	let timeoutId: NodeJS.Timeout | number; // Correct type for timeout ID

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

	async function handleSubmit() {
		clearTimeout(timeoutId as number);
		errorMessage = '';

		isPending = true;

		// After each guess, make sure the sort order is set to 'similarityScore (desc)'
		// if (sortBy !== 'similarityScore' || sortOrder !== 'desc') {
		// 	setSortOrder('similarityScore');
		// }

		// If guess is already in the guess array, just update the latest guess
		const isAlreadyGuessed = guesses.some((g) => g.word === guess.trim().toLowerCase());

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

			isPending = false;
			guess = '';

			await tick(); // Wait for the DOM to update
			if (inputElement) inputElement.focus({ preventScroll: true }); // Keep the input focused
			return;
		}

		const result = await processGuess(
			guess.trim().toLowerCase(),
			secretWord,
			secretWordVec,
			winState
		);

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
		if (inputElement) inputElement.focus({ preventScroll: true }); // Keep the input focused
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	onMount(async () => {
		await tick();
		if (inputElement && winState === 'playing') inputElement.focus({ preventScroll: true });
	});
</script>

<NotificationBanner {isPending} {errorMessage} />

<div class="mx-0 my-2 flex w-full items-center text-base sm:my-6">
	<input
		bind:this={inputElement}
		bind:value={guess}
		on:keydown={handleKeyDown}
		placeholder="Arvaa sana"
		type="search"
		inputmode="text"
		autocorrect="off"
		autocapitalize="none"
		autocomplete="off"
		spellcheck="false"
		disabled={isPending}
		class="text- flex-grow rounded-l-3xl bg-input-bg-light p-3 pl-6 placeholder:text-gray-400 focus:outline-none disabled:cursor-wait disabled:bg-white disabled:text-gray-400 dark:bg-input-bg-dark dark:placeholder:text-gray-200"
	/>
	<input
		on:click={handleSubmit}
		disabled={isPending}
		class="duration-250 w-24 cursor-pointer rounded-r-3xl bg-submit-btn-bg-light py-3 text-center text-white transition-colors ease-in-out hover:bg-submit-btn-bg-hover-light focus:outline-none dark:bg-submit-btn-bg-dark dark:hover:bg-submit-btn-bg-hover-dark sm:w-32"
		value="Arvaa"
	/>
</div>
