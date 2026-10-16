<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { slide } from 'svelte/transition';
	import { _ } from 'svelte-i18n';
	import { DAILY_RESULT_CAP, getUtc3UnixDay } from '$lib/leaderboard/constants';
	import { bestUnhintedCloseness } from '$lib/leaderboard/ranking';
	import { findPostedForDay, getPostedResult, savePostedResult } from '$lib/leaderboard/posted';
	import { getGameNumberForUtc3Day } from '$lib/utils/utils';
	import { leaderboardDay, type LeaderboardDay } from '$stores/leaderboardModal';
	import type { LeaderboardRow } from '$lib/leaderboard/types';
	import type { Guess, WinState } from '$lib/types';

	export let winState: WinState;
	export let guesses: Guess[];
	export let hintsUsed: number;
	export let gameNumber: number;
	export let collapsible = true;
	export let anchorId = '';
	export let titleId = '';
	export let showDayTabs = false;

	const winGrid =
		'grid grid-cols-[2rem_minmax(0,1fr)_4rem_3.6rem] gap-x-1.5 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] sm:gap-x-3';
	const giveUpGrid =
		'grid grid-cols-[2rem_minmax(0,1fr)_4.6rem_3.5rem] gap-x-1.5 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto_auto] sm:gap-x-3';
	const colHeader =
		'text-[9px] font-semibold uppercase leading-tight tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px] sm:tracking-wider';

	let todayRows: LeaderboardRow[] = [];
	let yesterdayRows: LeaderboardRow[] = [];
	let day: LeaderboardDay = 'today';
	let postedId: string | null = null;
	let yesterdayPostedId: string | null = null;
	let showForm = true;
	let expanded = true;
	let nameInput = '';
	let pending = false;
	let loadError = '';
	let postError = '';

	$: rows = day === 'yesterday' ? yesterdayRows : todayRows;
	$: closeness = bestUnhintedCloseness(guesses);
	$: wins = rows.filter((row) => row.outcome === 'won');
	$: giveUps = rows.filter((row) => row.outcome === 'gaveUp');
	$: boardFull = todayRows.length >= DAILY_RESULT_CAP && !postedId;
	$: canPost = winState === 'won' || winState === 'gaveUp';
	$: viewingToday = day === 'today';
	$: activePostedId = viewingToday ? postedId : yesterdayPostedId;
	$: shown = !collapsible || expanded;

	function selectDay(next: LeaderboardDay) {
		day = next;
		leaderboardDay.set(next);
	}

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
			const data = (await response.json()) as {
				today?: LeaderboardRow[];
				yesterday?: LeaderboardRow[];
				results?: LeaderboardRow[];
			};
			todayRows = data.today ?? data.results ?? [];
			yesterdayRows = data.yesterday ?? [];
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
			savePostedResult(gameNumber, {
				id: data.id,
				name: data.name,
				outcome: winState,
				dayId: getUtc3UnixDay(),
			});
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
		if (showDayTabs) {
			day = get(leaderboardDay);
			const yesterday = getUtc3UnixDay() - 1;
			yesterdayPostedId =
				findPostedForDay(Object.entries(localStorage), yesterday, getGameNumberForUtc3Day(yesterday))?.id ?? null;
		}
		const posted = getPostedResult(gameNumber);
		if (posted) {
			postedId = posted.id;
			showForm = false;
		}
		loadBoard();
	});
</script>

<div
	id={anchorId || undefined}
	class="mb-4 scroll-mt-4 overflow-hidden rounded-3xl bg-winstate-bg-light dark:bg-winstate-bg-dark"
>
	<div class="px-3 pt-4 sm:px-8 {shown ? 'pb-5 sm:pb-6 sm:pt-6' : 'pb-3 sm:pb-3.5'}">
		{#if collapsible}
			<button
				type="button"
				class="mx-auto flex items-center justify-center gap-1.5"
				aria-expanded={expanded}
				on:click={toggleExpanded}
			>
				<h2 class="text-lg font-bold sm:text-xl">
					{showDayTabs && !viewingToday ? $_('leaderboard.yesterdayTitle') : $_('leaderboard.title')}
				</h2>
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
		{:else}
			<h2 id={titleId || undefined} class="px-10 text-center text-lg font-bold sm:text-xl">
				{showDayTabs && !viewingToday ? $_('leaderboard.yesterdayTitle') : $_('leaderboard.title')}
			</h2>
		{/if}

		{#if shown}
			<div transition:slide={{ duration: 250 }}>
				{#if showDayTabs}
					<div class="mx-auto mt-3 flex max-w-xs rounded-full bg-black/10 p-1 dark:bg-white/10" role="tablist">
						<button
							type="button"
							role="tab"
							class="flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors {!viewingToday
								? 'bg-white text-text-light shadow-sm dark:bg-white/15 dark:text-white'
								: 'text-gray-600 dark:text-gray-300'}"
							aria-selected={!viewingToday}
							on:click={() => selectDay('yesterday')}
						>
							{$_('leaderboard.yesterday')}
						</button>
						<button
							type="button"
							role="tab"
							class="flex-1 rounded-full px-3 py-1.5 text-sm font-semibold transition-colors {viewingToday
								? 'bg-white text-text-light shadow-sm dark:bg-white/15 dark:text-white'
								: 'text-gray-600 dark:text-gray-300'}"
							aria-selected={viewingToday}
							on:click={() => selectDay('today')}
						>
							{$_('leaderboard.today')}
						</button>
					</div>
				{/if}

				{#if viewingToday && postedId}
					<p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
						{$_('leaderboard.posted')}
					</p>
				{:else if viewingToday && boardFull}
					<p class="mt-1 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
						{$_('leaderboard.capReached')}
					</p>
				{/if}

				{#if viewingToday && canPost && !postedId && !boardFull && showForm}
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
				{:else if viewingToday && canPost && !postedId && !boardFull}
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
					<p class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
						{viewingToday ? $_('leaderboard.empty') : $_('leaderboard.yesterdayEmpty')}
					</p>
				{:else}
					<div class="mt-4 max-h-80 overflow-y-auto overscroll-contain pr-1">
						{#if wins.length > 0}
							<div class="mb-1 items-end px-2 {winGrid} {colHeader} sm:px-3">
								<span>{$_('leaderboard.place')}</span>
								<span>{$_('leaderboard.name')}</span>
								<span class="text-right sm:min-w-[4.5rem]">{$_('leaderboard.guesses')}</span>
								<span class="text-right sm:min-w-[4rem]">{$_('leaderboard.hints')}</span>
							</div>
							<ol class="space-y-0.5">
								{#each wins as row}
									<li
										class="items-center rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 {winGrid} {row.id ===
										activePostedId
											? 'bg-light-purple-300/80 dark:bg-dark-purple-200'
											: 'bg-white/45 dark:bg-black/20'}"
									>
										<span class="font-Concert text-sm tabular-nums sm:text-base">{row.place}</span>
										<span class="flex min-w-0 items-baseline gap-1 sm:gap-1.5">
											<span class="min-w-0 truncate text-sm font-semibold">{displayName(row)}</span>
											{#if row.id === activePostedId}
												<span
													class="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-dark-purple-200 dark:text-highlight-dark sm:text-[10px]"
													>{$_('leaderboard.you')}</span
												>
											{/if}
										</span>
										<span class="text-right text-xs tabular-nums sm:min-w-[4.5rem] sm:text-sm"
											>{row.guessCount}</span
										>
										<span
											class="text-right text-xs tabular-nums text-gray-600 dark:text-gray-300 sm:min-w-[4rem] sm:text-sm"
											>{row.hintCount}</span
										>
									</li>
								{/each}
							</ol>
						{/if}

						{#if giveUps.length > 0}
							<div
								class="mb-1.5 mt-3 flex items-center gap-3 text-[9px] font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 sm:text-[11px] sm:tracking-wider"
							>
								<div class="h-px flex-1 bg-gray-300 dark:bg-white/15"></div>
								<span>{$_('leaderboard.giveUps')}</span>
								<div class="h-px flex-1 bg-gray-300 dark:bg-white/15"></div>
							</div>
							<div class="mb-1 items-end px-2 {giveUpGrid} {colHeader} sm:px-3">
								<span>{$_('leaderboard.place')}</span>
								<span>{$_('leaderboard.name')}</span>
								<span class="text-right leading-tight sm:min-w-[8.5rem] sm:whitespace-nowrap">
									<span class="sm:hidden">{$_('leaderboard.guesses')}/<br />{$_('leaderboard.hints')}</span>
									<span class="hidden sm:inline">{$_('leaderboard.guessesAndHints')}</span>
								</span>
								<span class="whitespace-normal text-right leading-tight sm:min-w-[5.5rem] sm:whitespace-nowrap"
									>{$_('leaderboard.closest')}</span
								>
							</div>
							<ol class="space-y-0.5">
								{#each giveUps as row}
									<li
										class="items-center rounded-xl px-2 py-1 sm:px-3 sm:py-1.5 {giveUpGrid} {row.id ===
										activePostedId
											? 'bg-light-purple-300/80 dark:bg-dark-purple-200'
											: 'bg-white/45 dark:bg-black/20'}"
									>
										<span
											class="font-Concert text-sm tabular-nums text-gray-500 dark:text-gray-400 sm:text-base"
											>{row.place}</span
										>
										<span class="flex min-w-0 items-baseline gap-1 sm:gap-1.5">
											<span class="min-w-0 truncate text-sm font-medium">{displayName(row)}</span>
											{#if row.id === activePostedId}
												<span
													class="shrink-0 text-[9px] font-semibold uppercase tracking-wide text-dark-purple-200 dark:text-highlight-dark sm:text-[10px]"
													>{$_('leaderboard.you')}</span
												>
											{/if}
										</span>
										<span
											class="whitespace-nowrap text-right text-xs tabular-nums sm:min-w-[8.5rem] sm:text-sm"
											>{row.guessCount}<span class="text-gray-400">/</span>{row.hintCount}</span
										>
										<span class="text-right sm:min-w-[5.5rem]">
											<span
												class="inline-block rounded-full bg-white/70 px-1.5 py-0.5 text-[10px] font-medium tabular-nums dark:bg-black/30 sm:px-2 sm:text-[11px]"
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
