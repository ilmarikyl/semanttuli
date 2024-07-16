<!-- in $components/GameControls.svelte -->

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { gameState } from '$stores/gameState';
	import { getHintWord } from '$lib/utils/gameLogic';
	import { MAX_HINTS } from '$lib/utils/constants';
	import { getSecretWord } from '$lib/utils/utils';
	import { updateWinState } from '$stores/gameState';

	export let gameNumber: number;

	let showGiveUpConfirmation = false;
	let hintPending = false;

	$: winState = $gameState.winState;
	$: secretWord = getSecretWord(gameNumber);
	$: hintsUsed = $gameState.guesses.filter((guess) => guess.wasHinted).length;
	$: highestRank =
		Math.max(
			...$gameState.guesses.map((guess) => guess.rank).filter((rank) => typeof rank === 'number')
		) || 0;

	function giveUp() {
		updateWinState('gaveUp');
		showGiveUpConfirmation = false;

		if (window.scrollY > 150) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	async function handleGetHint() {
		hintPending = true;
		try {
			await getHintWord(secretWord);
			if (window.scrollY > 125) {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}
		} finally {
			hintPending = false;
		}
	}
</script>

{#if winState === 'playing' && $gameState.guesses.length > 0}
	<div in:fade={{ duration: 1000 }} class="mt-8 flex justify-between gap-4 px-4">
		<button
			class="duration-250 w-28 rounded-3xl bg-btn-bg-primary-light py-2 text-sm text-white transition-colors ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-primary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
			on:click={() => (showGiveUpConfirmation = true)}
		>
			Luovuta
		</button>

		{#if highestRank < 999}
			<button
				on:click={handleGetHint}
				class="duration-250 w-32 rounded-3xl bg-btn-bg-primary-light py-2 text-sm text-white transition-colors ease-in-out hover:bg-btn-bg-primary-hover-light disabled:cursor-not-allowed disabled:bg-gray-400 dark:bg-btn-bg-primary-dark dark:hover:bg-btn-bg-primary-hover-dark disabled:dark:bg-gray-800 sm:text-base"
				disabled={hintPending || $gameState.winState !== 'playing' || hintsUsed >= MAX_HINTS}
			>
				Vinkki #{Math.min(hintsUsed + 1, MAX_HINTS)}/{MAX_HINTS}
			</button>
		{/if}
	</div>
{/if}

{#if showGiveUpConfirmation}
	<div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
		<div class="space-y-4 rounded-lg bg-white p-6 dark:bg-gray-800">
			<p class="py-6 text-lg">Oletko varma, että haluat luovuttaa?</p>
			<div class="flex justify-around">
				<button
					class="duration-250 rounded bg-red-400 dark:bg-red-900 dark:hover:bg-red-800 px-4 py-2 text-white transition-colors ease-in-out hover:bg-red-500"
					on:click={giveUp}
				>
					Kyllä
				</button>
				<button
					class="duration-250 rounded bg-gray-400 px-4 py-2 transition-colors ease-in-out text-white hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-500"
					on:click={() => (showGiveUpConfirmation = false)}
				>
					Peruuta
				</button>
			</div>
		</div>
	</div>
{/if}
