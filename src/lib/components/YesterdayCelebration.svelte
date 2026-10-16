<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';
	import { ConfettiBurst, FallingConfetti } from 'svelte-canvas-confetti';
	import { _ } from 'svelte-i18n';
	import {
		celebrationPreview,
		loadYesterdayCelebration,
		type YesterdayCelebration,
	} from '$lib/leaderboard/celebration';
	import { openLeaderboard } from '$stores/leaderboardModal';

	let celebration: YesterdayCelebration | null = null;
	let origin: [number, number] = [0, 0];

	const winGrid =
		'grid grid-cols-[1.75rem_minmax(0,1fr)_2.6rem_2.4rem] gap-x-1.5 sm:grid-cols-[2rem_minmax(0,1fr)_auto_auto] sm:gap-x-3';
	const colHeader =
		'text-[9px] font-semibold uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px]';

	function dismiss() {
		celebration = null;
	}

	function onBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) dismiss();
	}

	function seeBoard() {
		celebration = null;
		openLeaderboard('yesterday');
	}

	function onKeydown(event: KeyboardEvent) {
		if (celebration && event.key === 'Escape') dismiss();
	}

	function markYou(node: HTMLElement, you: boolean) {
		if (you) node.scrollIntoView({ block: 'nearest' });
	}

	onMount(async () => {
		origin = [window.innerWidth / 2, window.innerHeight / 3];
		celebration = celebrationPreview(window.location.search, import.meta.env.DEV) ?? (await loadYesterdayCelebration());
	});
</script>

<svelte:window on:keydown={onKeydown} />

{#if celebration}
	<FallingConfetti />
	<ConfettiBurst {origin} />
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 font-Rubik"
		role="button"
		tabindex="0"
		aria-label={$_('leaderboard.close')}
		transition:fade={{ duration: 200 }}
		on:click={onBackdropClick}
		on:keydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				dismiss();
			}
		}}
	>
		<div
			class="w-full max-w-md rounded-3xl bg-winstate-bg-light px-4 py-6 text-center shadow-xl dark:bg-winstate-bg-dark sm:px-6"
			role="dialog"
			aria-modal="true"
			aria-labelledby="yesterday-celebration-title"
			in:scale={{ duration: 280, start: 0.92 }}
		>
			<p id="yesterday-celebration-title" class="text-sm font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
				{$_('leaderboard.celebration.title')}
			</p>
			<p class="mt-2 text-lg font-bold">
				{$_('leaderboard.celebration.body', { values: { place: celebration.place } })}
			</p>
			<div class="mt-4 max-h-[50vh] overflow-y-auto overscroll-contain text-left">
				<div class="mb-1 items-end px-2 {winGrid} {colHeader}">
					<span>{$_('leaderboard.place')}</span>
					<span>{$_('leaderboard.name')}</span>
					<span class="text-right">{$_('leaderboard.guesses')}</span>
					<span class="text-right">{$_('leaderboard.hints')}</span>
				</div>
				<ol class="space-y-0.5">
					{#each celebration.top as row (row.place)}
						<li
							use:markYou={row.you}
							class="items-center rounded-xl px-2 py-1 {winGrid} {row.you
								? 'bg-light-purple-300/80 dark:bg-dark-purple-200'
								: 'bg-white/45 dark:bg-black/20'}"
						>
							<span class="font-Concert text-sm tabular-nums">{row.place}</span>
							<span class="flex min-w-0 items-baseline gap-1">
								<span class="min-w-0 truncate text-sm font-semibold">{row.name ?? $_('leaderboard.anonymous')}</span>
								{#if row.you}
									<span
										class="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-dark-purple-200 dark:text-highlight-dark"
										>{$_('leaderboard.you')}</span
									>
								{/if}
							</span>
							<span class="text-right text-xs tabular-nums">{row.guessCount}</span>
							<span class="text-right text-xs tabular-nums text-gray-600 dark:text-gray-300">{row.hintCount}</span>
						</li>
					{/each}
				</ol>
			</div>
			<div class="mt-5 flex flex-wrap items-center justify-center gap-2">
				<button
					type="button"
					class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark"
					on:click={seeBoard}
				>
					{$_('leaderboard.celebration.seeBoard')}
				</button>
				<button
					type="button"
					class="px-3 py-2 text-sm text-gray-500 underline decoration-gray-400 underline-offset-2 dark:text-gray-300"
					on:click={dismiss}
				>
					{$_('leaderboard.close')}
				</button>
			</div>
		</div>
	</div>
{/if}
