<script lang="ts">
	import { onMount } from 'svelte';
	import { FallingConfetti, ConfettiBurst, random } from 'svelte-canvas-confetti';
	import { getGameNumber, getSecretWord, decodeB64word } from '$lib/utils/utils';
	import { fetchInitialGameData } from '$lib/utils/gameLogic';
	import { saveGame } from '$lib/utils/localStorage';
	import { gameState, loadGameState, toggleGameInfoCollapsed } from '$stores/gameState';
	import { GameInfo, GameControls, GuessForm, Guesses, WinState } from '$components';
	import { openModal } from '$stores/infoModal';

	const gameNumber = getGameNumber();
	const secretWord = getSecretWord(gameNumber);

	$: ({ winState, latestGuess, guesses } = $gameState);
	$: showConfetti = winState === 'won';
	$: hintsUsed = guesses.filter((guess) => guess.wasHinted).length;

	$: if (typeof window !== 'undefined' && guesses.length > 0) {
		saveGame(winState, guesses, latestGuess ?? undefined, decodeB64word(secretWord));
	}

	$: if (winState === 'won' || winState === 'gaveUp') {
		toggleGameInfoCollapsed(true);
	}

	function getConfettiBurstOrigin(): [number, number] {
		if (typeof window !== 'undefined') {
			return [
				random(window.innerWidth / 2, window.innerWidth / 2),
				random(window.innerHeight / 4, window.innerHeight / 4)
			];
		}
		return [0, 0];
	}

	onMount(async () => {
		loadGameState(gameNumber);
		await fetchInitialGameData(secretWord, gameNumber);

		// Check if the info has been displayed before
		const infoDisplayed = localStorage.getItem('infoDisplayed');
		if (!infoDisplayed || infoDisplayed !== 'true') {
			openModal();
			localStorage.setItem('infoDisplayed', 'true');
		}
	});
</script>

<GameInfo />

{#if showConfetti}
	<FallingConfetti />
	<ConfettiBurst origin={getConfettiBurstOrigin()} />
{/if}

<WinState {winState} {guesses} {hintsUsed} {secretWord} {gameNumber} />
<GuessForm {secretWord} />
<Guesses />
<GameControls {gameNumber} />