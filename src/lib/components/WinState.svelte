<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import { copy } from 'svelte-copy';
	import { getClipboardContent } from '$lib/utils/utils';
	import { decodeB64word } from '$lib/utils/utils';
	import { statsStore } from '$stores/stats';
	import type { Guess } from '$lib/types';

	export let winState: string;
	export let guesses: Guess[];
	export let hintsUsed: number;
	export let secretWord: string;
	export let gameNumber: number;

	let displayCopied = false;

	$: showStats = winState === 'won';

	function displayCopiedText() {
		setTimeout(() => {
			displayCopied = false;
		}, 3000);
		displayCopied = true;
	}

	function toggleStats() {
		showStats = !showStats;
	}

	$: statsItems = [
		{ label: 'Pelejä yhteensä', value: $statsStore.totalPlayDays, icon: '🎮' },
		{ label: 'Voittoja', value: $statsStore.wins, icon: '🏆' },
		{ label: 'Luovutuksia', value: $statsStore.giveUps, icon: '🏳️' },
		{ label: 'Kesken jääneitä', value: $statsStore.abandons, icon: '⏸️' },
		{ label: 'Arvauksia yhteensä', value: $statsStore.totalGuesses, icon: '🤔' },
		{ label: 'Vinkkejä yhteensä', value: $statsStore.totalHints || 0, icon: '💡' },
		{
			label: 'Keskimääräinen arvausmäärä',
			value: ($statsStore.totalGuesses / $statsStore.totalPlayDays).toFixed(1),
			icon: '📊'
		},
		{ label: 'Voittoputki', value: $statsStore.winStreak, icon: '🔥' }
	];
</script>

{#if winState === 'won'}
	<div class="mb-4 rounded-3xl bg-winstate-bg-light p-3 dark:bg-winstate-bg-dark sm:p-6">
		<div class="space-y-3 text-sm sm:text-base">
			<p class="text-base font-semibold sm:text-lg">
				Löysit salaisen sanan <span
					class="text-xl font-bold text-highlight-light dark:text-highlight-dark sm:text-2xl"
					>{guesses.length}.</span
				>
				arvauksella! <span class="ml-1 text-2xl">🎉</span>
			</p>
			<p>
				<span class="mr-2">✅</span> Salainen sana on:
				<span class="mx-1 font-bold">{decodeB64word(secretWord)}</span>
			</p>
			<p class="flex items-center">
				{#if hintsUsed > 0}
					<span class="mr-2">💡</span> Käytit yhteensä
					<span class="mx-1 font-bold">{hintsUsed}</span> vinkkiä
				{:else}
					<span class="mr-2">🧠</span> Et käyttänyt yhtään vinkkiä!
				{/if}
			</p>
			<p>
				<span class="mr-2">🔍</span>
				Näet salaista sanaa lähimmät sanat
				<a
					href={`/nearby_1k/${secretWord}`}
					class="font-semibold underline transition-colors duration-200 ease-in-out">täällä</a
				>
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Voit halutessasi yhä jatkaa sanojen syöttämistä.
			</p>
		</div>
		<div class="mt-4 flex items-center justify-between">
			<button
				class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
				on:click={displayCopiedText}
				use:copy={getClipboardContent(winState, gameNumber, guesses, hintsUsed)}
			>
				Jaa tulos
			</button>
			<button
				class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
				on:click={toggleStats}
			>
				{showStats ? 'Piilota statistiikka' : 'Näytä statistiikka'}
			</button>
		</div>
		<div class="mt-2 h-3 text-sm">
			{#if displayCopied}
				<span in:fade={{ duration: 250 }} out:fade={{ duration: 250 }} class="ml-3 font-bold">
					Tulos kopioitu leikepöydälle!
				</span>
			{/if}
		</div>
		{#if showStats}
			<div transition:slide={{ duration: 300 }} class="mt-4 rounded-xl p-6 py-0">
				<h3 class="mb-4 text-center text-lg font-bold sm:text-2xl">Pelistatistiikka</h3>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each statsItems as { label, value, icon }}
						<div
							class="flex flex-col items-center justify-center rounded-lg bg-light-purple-200 p-4 transition-all hover:scale-105 dark:bg-dark-purple-200"
						>
							<span class="mb-2 text-2xl sm:text-3xl">{icon}</span>
							<span class="text-center text-xs font-semibold opacity-80 sm:text-sm">{label}</span>
							<span class="text-lg font-bold sm:text-xl">{value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

{#if winState === 'gaveUp'}
	<div class="mb-4 rounded-3xl bg-red-100 p-6 dark:bg-red-950">
		<div class="relative overflow-hidden">
			<h2 class="mb-4 text-lg font-bold sm:text-2xl">
				<span class="mr-2 text-3xl sm:text-4xl">🏳️</span> Luovutit
				<span class="ml-2 text-3xl sm:text-4xl">🥲</span>
			</h2>
		</div>
		<div class="space-y-3 text-sm sm:text-base">
			<p>
				<span class="mr-2">❌</span> Salainen sana olisi ollut:
				<span class="mx-1 font-bold text-red-800 dark:text-red-300"
					>{decodeB64word(secretWord)}</span
				>
			</p>
			<p class="flex items-center">
				<span class="mr-2">🔢</span> Käytit yhteensä
				<span class="mx-1 font-bold">{guesses.length}</span> arvausta
			</p>
			<p class="flex items-center">
				<span class="mr-2">💡</span> Käytit yhteensä
				<span class="mx-1 font-bold">{hintsUsed}</span> vinkkiä
			</p>
			<p>
				<span class="mr-2">🔍</span>
				Näet salaista sanaa lähimmät sanat
				<a
					href={`/nearby_1k/${secretWord}`}
					class="font-semibold underline transition-colors duration-200 ease-in-out hover:text-red-600 dark:hover:text-red-400"
					>täällä</a
				>
			</p>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Voit halutessasi yhä jatkaa sanojen syöttämistä.
			</p>
		</div>
		<div class="mt-4 flex items-center justify-between">
			<button
				class="rounded-full bg-red-400 px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800 sm:text-base"
				on:click={displayCopiedText}
				use:copy={getClipboardContent(winState, gameNumber, guesses, hintsUsed)}
			>
				Jaa tulos
			</button>
			<button
				class="rounded-full bg-red-400 px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800 sm:text-base"
				on:click={toggleStats}
			>
				{showStats ? 'Piilota statistiikka' : 'Näytä statistiikka'}
			</button>
		</div>
		<div class="mt-2 h-3 text-sm">
			{#if displayCopied}
				<span
					in:fade={{ duration: 250 }}
					out:fade={{ duration: 250 }}
					class="ml-3 font-bold text-red-600 dark:text-red-400"
				>
					Tulos kopioitu leikepöydälle!
				</span>
			{/if}
		</div>
		{#if showStats}
			<div
				transition:slide={{ duration: 300 }}
				class="mt-4 rounded-xl bg-red-200 p-6 py-4 dark:bg-red-900"
			>
				<h3 class="mb-4 text-center text-lg font-bold sm:text-2xl">Pelistatistiikka</h3>
				<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
					{#each statsItems as { label, value, icon }}
						<div
							class="flex flex-col items-center justify-center rounded-lg bg-red-300 p-4 transition-all hover:scale-105 dark:bg-red-800"
						>
							<span class="mb-2 text-2xl sm:text-3xl">{icon}</span>
							<span class="text-center text-xs font-semibold opacity-80 sm:text-sm">{label}</span>
							<span class="text-lg font-bold sm:text-xl">{value}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}
