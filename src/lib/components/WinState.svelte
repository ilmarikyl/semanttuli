<script lang="ts">
  import { fade, slide } from "svelte/transition";
  import { copy } from "svelte-copy";
  import { getClipboardContent } from "$lib/utils/utils";
  import { decodeB64word } from "$lib/utils/utils";
  import { statsStore } from "$stores/stats";
  import { _ } from "svelte-i18n";
  import type { Guess } from "$lib/types";

  export let winState: string;
  export let guesses: Guess[];
  export let hintsUsed: number;
  export let secretWord: string;
  export let gameNumber: number;

  let displayCopied = false;
  let showStats = false;

  $: isWin = winState === "won";
  $: isDone = winState === "won" || winState === "gaveUp";
  $: decodedWord = decodeB64word(secretWord);

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
    { label: $_("stats.totalGames"), value: $statsStore.totalPlayDays, icon: "🎮" },
    { label: $_("stats.wins"), value: $statsStore.wins, icon: "🏆" },
    { label: $_("stats.giveUps"), value: $statsStore.giveUps, icon: "🏳️" },
    { label: $_("stats.abandons"), value: $statsStore.abandons, icon: "⏸️" },
    { label: $_("stats.totalGuesses"), value: $statsStore.totalGuesses, icon: "🤔" },
    { label: $_("stats.totalHints"), value: $statsStore.totalHints || 0, icon: "💡" },
    {
      label: $_("stats.averageGuesses"),
      value: ($statsStore.totalGuesses / $statsStore.totalPlayDays).toFixed(1),
      icon: "📊",
    },
    { label: $_("stats.winStreak"), value: $statsStore.winStreak, icon: "🔥" },
  ];
</script>

{#if isDone}
  <div
    class="mb-3 overflow-hidden rounded-3xl sm:mb-4 {isWin
      ? 'bg-winstate-bg-light dark:bg-winstate-bg-dark'
      : 'bg-red-100 dark:bg-red-950'}"
  >
    <div class="px-5 pb-5 pt-6 sm:px-8 sm:pb-6 sm:pt-8">
      <div class="text-center">
        {#if isWin}
          <p class="text-sm font-medium text-gray-600 dark:text-gray-300 sm:text-base">
            {$_("game.foundSecretWord")}
          </p>
          <p
            class="font-Concert mt-1 text-5xl leading-none text-highlight-light dark:text-highlight-dark sm:text-6xl"
          >
            {guesses.length}
          </p>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300 sm:text-base">
            {$_("game.withGuesses")}
          </p>
        {:else}
          <p class="text-xl font-bold sm:text-2xl">{$_("game.gaveUp")}</p>
        {/if}

        <div
          class="mt-5 inline-flex max-w-full flex-col items-center rounded-2xl px-5 py-3 {isWin
            ? 'bg-white/70 dark:bg-black/25'
            : 'bg-white/60 dark:bg-black/30'}"
        >
          <span class="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {isWin ? $_("game.secretWordIs") : $_("game.secretWordWouldHaveBeen")}
          </span>
          <span
            class="mt-0.5 break-all text-xl font-bold sm:text-2xl {isWin
              ? ''
              : 'text-red-800 dark:text-red-300'}"
          >
            {decodedWord}
          </span>
        </div>
      </div>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span
          class="rounded-full px-3 py-1.5 text-sm font-medium {isWin
            ? 'bg-light-purple-200 dark:bg-dark-purple-200'
            : 'bg-red-200 dark:bg-red-900'}"
        >
          {hintsUsed}
          {$_("game.hintsWord")}
        </span>
        {#if !isWin}
          <span class="rounded-full bg-red-200 px-3 py-1.5 text-sm font-medium dark:bg-red-900">
            {guesses.length}
            {$_("game.usedGuesses")}
          </span>
        {/if}
        <a
          href={`/nearby_1k/${secretWord}`}
          class="meta-chip rounded-full px-3 py-1.5 text-sm font-medium {isWin
            ? 'bg-light-purple-200 dark:bg-dark-purple-200'
            : 'bg-red-200 dark:bg-red-900'}"
        >
          {$_("game.nearestWordsLink")}
        </a>
      </div>

      <p class="mt-4 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        {$_("game.continueGuessing")}
      </p>

      <div class="mt-5 flex flex-wrap items-center justify-center gap-2">
        <button
          class="rounded-full px-5 py-2 text-sm text-white transition-colors duration-200 ease-in-out sm:text-base {isWin
            ? 'bg-btn-bg-primary-light hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark'
            : 'bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800'}"
          on:click={displayCopiedText}
          use:copy={getClipboardContent(winState, gameNumber, guesses, hintsUsed)}
        >
          {$_("game.shareResult")}
        </button>
        <button
          class="rounded-full px-5 py-2 text-sm text-white transition-colors duration-200 ease-in-out sm:text-base {isWin
            ? 'bg-btn-bg-primary-light hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark'
            : 'bg-red-400 hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800'}"
          on:click={toggleStats}
        >
          {showStats ? $_("stats.hideStats") : $_("stats.showStats")}
        </button>
      </div>

      {#if displayCopied}
        <p
          in:fade={{ duration: 250 }}
          out:fade={{ duration: 250 }}
          class="mt-3 text-center text-xs font-semibold sm:text-sm"
        >
          {$_("game.resultCopied")}
        </p>
      {/if}
    </div>

    {#if showStats}
      <div
        transition:slide={{ duration: 300 }}
        class="px-5 pb-6 sm:px-8 {isWin ? '' : 'bg-red-200/80 dark:bg-red-900/80'}"
      >
        <h3 class="mb-4 text-center text-base font-bold sm:text-lg">
          {$_("game.gameStats")}
        </h3>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {#each statsItems as { label, value, icon }}
            <div
              class="flex flex-col items-center justify-center rounded-2xl p-3 {isWin
                ? 'bg-light-purple-200 dark:bg-dark-purple-200'
                : 'bg-red-300 dark:bg-red-800'}"
            >
              <span class="mb-1 text-xl sm:text-2xl">{icon}</span>
              <span class="text-center text-[11px] font-semibold opacity-70 sm:text-xs">{label}</span>
              <span class="text-base font-bold sm:text-lg">{value}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  a.meta-chip {
    color: inherit;
    text-decoration: none;
  }
  a.meta-chip:hover {
    opacity: 0.8;
  }
</style>
