<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { _ } from 'svelte-i18n';
	import { DAILY_RESULT_CAP } from '$lib/leaderboard/constants';
	import { bestUnhintedCloseness } from '$lib/leaderboard/ranking';
	import { getPostedResult, savePostedResult } from '$lib/leaderboard/posted';
	import type { LeaderboardRow } from '$lib/leaderboard/types';
	import type { Guess, WinState } from '$lib/types';

	export let winState: WinState;
	export let guesses: Guess[];
	export let hintsUsed: number;
	export let gameNumber: number;

	let rows: LeaderboardRow[] = [];
	let postedId: string | null = null;
	let showForm = true;
	let expanded = true;
	let nameInput = '';
	let pending = false;
	let loadError = '';
	let postError = '';

	$: closeness = bestUnhintedCloseness(guesses);
	$: wins = rows.filter((row) => row.outcome === 'won');
	$: giveUps = rows.filter((row) => row.outcome === 'gaveUp');
	$: boardFull = rows.length >= DAILY_RESULT_CAP && !postedId;

	function toggleExpanded() {
		expanded = !expanded;
	}

	function displayName(row: LeaderboardRow): string {
		return row.name ?? $_('leaderboard.anonymous');
	}

	function closestLabel(row: LeaderboardRow): string {
		return (row.bestUnhintedSimilarity ?? 0).toFixed(2);
	}

	function errorFromCode(code: string): string {
		if (code === 'name-taken') return $_('leaderboard.nameTaken');
		if (code === 'reserved-name') return $_('leaderboard.nameReserved');
		if (code === 'invalid-name') return $_('leaderboard.nameInvalid');
		if (code === 'cap-reached') return $_('leaderboard.capReached');
		return $_('leaderboard.postError');
	}

	async function loadBoard() {
		loadError = '';
		try {
			const response = await fetch('/api/leaderboard');
			if (!response.ok) {
				loadError = $_('leaderboard.loadError');
				return;
			}
			const data = (await response.json()) as { results: LeaderboardRow[] };
			rows = data.results ?? [];
		} catch {
			loadError = $_('leaderboard.loadError');
		}
	}

	async function postResult(anonymous: boolean) {
		if (pending || postedId || winState === 'playing') return;
		postError = '';
		pending = true;
		try {
			const response = await fetch('/api/leaderboard', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name: anonymous ? '' : nameInput,
					outcome: winState,
					guessCount: guesses.length,
					hintCount: hintsUsed,
					bestUnhintedRank: closeness.rank,
					bestUnhintedSimilarity: closeness.similarity,
					gameNumber,
				}),
			});
			const data = await response.json();
			if (!response.ok || !data.ok) {
				postError = errorFromCode(data.error);
				return;
			}
			savePostedResult(gameNumber, { id: data.id, name: data.name });
			postedId = data.id;
			showForm = false;
			await loadBoard();
		} catch {
			postError = $_('leaderboard.postError');
		} finally {
			pending = false;
		}
	}

	onMount(() => {
		const posted = getPostedResult(gameNumber);
		if (posted) {
			postedId = posted.id;
			showForm = false;
		}
		loadBoard();
	});
</script>

<div class="mb-4 overflow-hidden rounded-3xl bg-winstate-bg-light dark:bg-winstate-bg-dark">
	<div class="px-5 pt-4 sm:px-8 {expanded ? 'pb-5 sm:pb-6 sm:pt-6' : 'pb-3 sm:pb-3.5'}">
		<button
			type="button"
			class="mx-auto flex items-center justify-center gap-1.5"
			aria-expanded={expanded}
			on:click={toggleExpanded}
		>
			<h2 class="text-lg font-bold sm:text-xl">{$_('leaderboard.title')}</h2>
			<svg
				class="h-6 w-6 shrink-0 text-gray-500 transition-transform duration-300 ease-in-out dark:text-gray-400"
				class:rotate-180={expanded}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
		</button>

		{#if expanded}
			<div transition:slide={{ duration: 250 }}>
				{#if postedId}
					<p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
						{$_('leaderboard.posted')}
					</p>
				{:else if boardFull}
					<p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
						{$_('leaderboard.capReached')}
					</p>
				{/if}

				{#if !postedId && !boardFull && showForm}
					<div class="mt-4 space-y-3">
						<input
							class="w-full rounded-full bg-input-bg-light px-4 py-2.5 text-sm dark:bg-input-bg-dark sm:text-base"
							type="text"
							maxlength="20"
							autocomplete="nickname"
							placeholder={$_('leaderboard.namePlaceholder')}
							bind:value={nameInput}
							disabled={pending}
						/>
						<div class="flex flex-wrap items-center justify-center gap-2">
							<button
								class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
								disabled={pending || nameInput.trim().length === 0}
								on:click={() => postResult(false)}
							>
								{$_('leaderboard.postNamed')}
							</button>
							<button
								class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
								disabled={pending}
								on:click={() => postResult(true)}
							>
								{$_('leaderboard.postAnonymous')}
							</button>
							<button
								class="px-3 py-2 text-sm text-gray-500 underline decoration-gray-400 underline-offset-2 dark:text-gray-400 sm:text-base"
								disabled={pending}
								on:click={() => (showForm = false)}
							>
								{$_('leaderboard.notNow')}
							</button>
						</div>
						{#if postError}
							<p class="text-center text-sm font-semibold text-red-500">{postError}</p>
						{/if}
					</div>
				{:else if !postedId && !boardFull}
					<div class="mt-4 text-center">
						<button
							class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
							on:click={() => (showForm = true)}
						>
							{$_('leaderboard.addResult')}
						</button>
					</div>
				{/if}

				{#if loadError}
					<p class="mt-5 text-center text-sm font-semibold text-red-500">{loadError}</p>
				{:else if rows.length === 0}
					<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">{$_('leaderboard.empty')}</p>
				{:else}
					<div class="mt-4 max-h-80 overflow-y-auto overscroll-contain pr-1">
						{#if wins.length > 0}
							<div
								class="mb-1 grid grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] gap-x-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:px-3 sm:text-xs"
							>
								<span>{$_('leaderboard.place')}</span>
								<span>{$_('leaderboard.name')}</span>
								<span class="min-w-[4.75rem] text-right">{$_('leaderboard.guesses')}</span>
								<span class="min-w-[4.25rem] text-right">{$_('leaderboard.hints')}</span>
							</div>
							<ol class="space-y-0.5">
								{#each wins as row}
									<li
										class="grid grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] items-center gap-x-3 rounded-xl px-3 py-1 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto] sm:px-3 sm:py-1.5 {row.id ===
										postedId
											? 'bg-light-purple-300/80 dark:bg-dark-purple-200'
											: 'bg-white/45 dark:bg-black/20'}"
									>
										<span class="font-Concert text-base tabular-nums sm:text-lg">{row.place}</span>
										<span class="flex min-w-0 items-baseline gap-2">
											<span class="truncate font-semibold">{displayName(row)}</span>
											{#if row.id === postedId}
												<span
													class="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-highlight-light dark:text-highlight-dark"
													>{$_('leaderboard.you')}</span
												>
											{/if}
										</span>
										<span class="min-w-[4.75rem] text-right tabular-nums text-sm sm:text-base"
											>{row.guessCount}</span
										>
										<span
											class="min-w-[4.25rem] text-right tabular-nums text-sm text-gray-600 dark:text-gray-300 sm:text-base"
											>{row.hintCount}</span
										>
									</li>
								{/each}
							</ol>
						{/if}

						{#if giveUps.length > 0}
							<div
								class="mb-1.5 mt-3 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:text-xs"
							>
								<div class="h-px flex-1 bg-gray-300 dark:bg-white/15"></div>
								<span>{$_('leaderboard.giveUps')}</span>
								<div class="h-px flex-1 bg-gray-300 dark:bg-white/15"></div>
							</div>
							<div
								class="mb-1 grid grid-cols-[2.25rem_minmax(0,1fr)_auto_auto_auto] gap-x-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto_auto] sm:px-3 sm:text-xs"
							>
								<span>{$_('leaderboard.place')}</span>
								<span>{$_('leaderboard.name')}</span>
								<span class="min-w-[4.75rem] text-right">{$_('leaderboard.guesses')}</span>
								<span class="min-w-[4.25rem] text-right">{$_('leaderboard.hints')}</span>
								<span class="min-w-[4.75rem] text-right leading-tight sm:min-w-[6.5rem]">{$_('leaderboard.closest')}</span>
							</div>
							<ol class="space-y-0.5">
								{#each giveUps as row}
									<li
										class="grid grid-cols-[2.25rem_minmax(0,1fr)_auto_auto_auto] items-center gap-x-3 rounded-xl px-3 py-1 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto_auto_auto] sm:px-3 sm:py-1.5 {row.id ===
										postedId
											? 'bg-light-purple-300/80 dark:bg-dark-purple-200'
											: 'bg-white/45 dark:bg-black/20'}"
									>
										<span
											class="font-Concert text-base tabular-nums text-gray-500 dark:text-gray-400 sm:text-lg"
											>{row.place}</span
										>
										<span class="flex min-w-0 items-baseline gap-2">
											<span class="truncate font-medium">{displayName(row)}</span>
											{#if row.id === postedId}
												<span
													class="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-highlight-light dark:text-highlight-dark"
													>{$_('leaderboard.you')}</span
												>
											{/if}
										</span>
										<span class="min-w-[4.75rem] text-right tabular-nums text-sm sm:text-base"
											>{row.guessCount}</span
										>
										<span
											class="min-w-[4.25rem] text-right tabular-nums text-sm text-gray-600 dark:text-gray-300 sm:text-base"
											>{row.hintCount}</span
										>
										<span class="min-w-[4.75rem] text-right sm:min-w-[6.5rem]">
											<span
												class="inline-block rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium dark:bg-black/30 sm:text-xs"
											>
												{closestLabel(row)}
											</span>
										</span>
									</li>
								{/each}
							</ol>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
