<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { gameState } from '$stores/gameState';
	import { closeLeaderboard, isLeaderboardOpen } from '$stores/leaderboardModal';
	import { getGameNumber } from '$lib/utils/utils';
	import Leaderboard from './Leaderboard.svelte';

	const gameNumber = getGameNumber();

	$: guesses = $gameState.guesses;
	$: winState = $gameState.winState;
	$: hintsUsed = guesses.filter((guess) => guess.wasHinted).length;

	function handleKeydown(event: KeyboardEvent) {
		if ($isLeaderboardOpen && event.key === 'Escape') closeLeaderboard();
	}

	function handleBackdropClick(event: MouseEvent) {
		if ((event.target as HTMLElement).id === 'leaderboard-backdrop') {
			closeLeaderboard();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $isLeaderboardOpen}
	<div
		id="leaderboard-backdrop"
		class="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/50 px-2 py-6 font-Rubik sm:items-center sm:py-10"
		role="presentation"
		on:click={handleBackdropClick}
	>
		<div
			class="relative w-full max-w-3xl"
			role="dialog"
			aria-modal="true"
			aria-labelledby="leaderboard-modal-title"
		>
			<button
				type="button"
				class="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 text-gray-500 shadow-sm transition-colors duration-200 ease-in-out hover:text-red-600 dark:bg-neutral-800 dark:text-gray-300 dark:hover:text-red-400"
				aria-label={$_('leaderboard.close')}
				on:click={closeLeaderboard}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-5 w-5">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
			<Leaderboard
				{winState}
				{guesses}
				{hintsUsed}
				{gameNumber}
				collapsible={false}
				titleId="leaderboard-modal-title"
			/>
		</div>
	</div>
{/if}
