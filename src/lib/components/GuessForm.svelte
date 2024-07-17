<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { gameState, updateGuesses, setSortOrder } from '$stores/gameState';
	import { MobileKeyboard, NotificationBanner } from '$lib/components';
	import { processGuess } from '$lib/utils/gameLogic';
	import { isModalOpen } from '$stores/infoModal';
	import { isKeyboardVisible, showKeyboard, hideKeyboard } from '$stores/keyboard';

	export let secretWord: string;

	let guess: string = '';
	let errorMessage: string;
	let isPending: boolean = false;
	let isMobile: boolean = false;
	let inputElement: HTMLInputElement;
	let timeoutId: NodeJS.Timeout | number; // Correct type for timeout ID

	$: secretWordVec = $gameState.secretWordVec;
	$: guesses = $gameState.guesses;
	$: sortOrder = $gameState.sortOrder;
	$: sortBy = $gameState.sortBy;
	$: winState = $gameState.winState;

	function addLetter(letter: string) {
		guess += letter;
	}

	function removeLetter() {
		guess = guess.slice(0, -1);
	}

	function displayErrorMessage() {
		timeoutId = setTimeout(() => {
			errorMessage = '';
		}, 3000);
	}

	$: if ($isModalOpen) {
		hideKeyboard();
	}

	async function handleSubmit() {
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

	async function handleInputFocus() {
		if (isMobile) {
			showKeyboard();
		}
	}

	function handleInputBlur(event: FocusEvent) {
		// Prevent hiding the keyboard if the new focus target is within the custom keyboard
		if (event.relatedTarget && (event.relatedTarget as HTMLElement).closest('.custom-keyboard')) {
			return;
		}
		// showKeyboard = false;
	}

	function clearAllLetters() {
		guess = '';
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	}

	onMount(async () => {
		isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
		await tick();
		if (inputElement && winState === 'playing') inputElement.focus();
	});
</script>

<NotificationBanner {isPending} {errorMessage} />

<div class="mx-0 my-2 flex w-full items-center text-sm sm:my-6 sm:text-base">
	<input
		bind:this={inputElement}
		bind:value={guess}
		on:focus={handleInputFocus}
		on:blur={handleInputBlur}
		on:keydown={handleKeyDown}
		on:click={showKeyboard}
		placeholder="Arvaa sana"
		type="text"
		inputmode={isMobile ? 'none' : 'text'}
		autocorrect="off"
		autocapitalize="none"
		autocomplete="off"
		spellcheck="false"
		disabled={isPending}
		class="flex-grow rounded-l-3xl bg-input-bg-light p-3 pl-6 placeholder:text-gray-400 focus:outline-none disabled:cursor-wait disabled:bg-white disabled:text-gray-400 dark:bg-input-bg-dark dark:placeholder:text-gray-200"
	/>
	<button
		on:click={handleSubmit}
		disabled={isPending}
		class="duration-250 w-24 rounded-r-3xl bg-submit-btn-bg-light py-3 text-white transition-colors ease-in-out hover:bg-submit-btn-bg-hover-light dark:bg-submit-btn-bg-dark dark:hover:bg-submit-btn-bg-hover-dark sm:w-32"
	>
		Arvaa
	</button>
</div>

{#if isMobile && $isKeyboardVisible}
	<MobileKeyboard {isPending} {addLetter} {removeLetter} {handleSubmit} {clearAllLetters} />
{/if}
