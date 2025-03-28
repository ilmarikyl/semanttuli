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

{#if winState === "won"}
  <div class="mb-1 rounded-3xl bg-winstate-bg-light p-3 dark:bg-winstate-bg-dark sm:mb-4 sm:p-6">
    <div class="space-y-1 text-sm sm:space-y-3 sm:text-base">
      <p class="text-base font-semibold sm:text-lg">
        {$_("game.foundSecretWord")}
        <span class="text-xl font-bold text-highlight-light dark:text-highlight-dark sm:text-2xl"
          >{guesses.length}</span
        >
        {$_("game.withGuesses")}! <span class="ml-1 text-2xl">🎉</span>
      </p>
      <p>
        <span class="mr-2">✅</span>
        {$_("game.secretWordIs")}
        <span class="mx-1 font-bold">{decodeB64word(secretWord)}</span>
      </p>
      <p class="flex items-center">
        {#if hintsUsed > 0}
          <span class="mr-2">💡</span>
          {$_("game.hintsUsedTotal")}
          <span class="mx-1 font-bold">{hintsUsed}</span>
          {$_("game.hintsWord")}
        {:else}
          <span class="mr-2">🧠</span> {$_("game.noHintsUsed")}
        {/if}
      </p>
      <p>
        <span class="mr-2">🔍</span>
        {$_("game.seeNearestWords")}
        <a href={`/nearby_1k/${secretWord}`} class="font-semibold underline transition-colors duration-200 ease-in-out"
          >{$_("game.here")}</a
        >
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {$_("game.continueGuessing")}
      </p>
    </div>
    <div class="mt-2 flex items-center justify-between sm:mt-4">
      <button
        class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
        on:click={displayCopiedText}
        use:copy={getClipboardContent(winState, gameNumber, guesses, hintsUsed)}
      >
        {$_("game.shareResult")}
      </button>
      <button
        class="rounded-full bg-btn-bg-primary-light px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-btn-bg-primary-hover-light dark:bg-btn-bg-secondary-dark dark:hover:bg-btn-bg-primary-hover-dark sm:text-base"
        on:click={toggleStats}
      >
        {showStats ? $_("stats.hideStats") : $_("stats.showStats")}
      </button>
    </div>
    {#if displayCopied}
      <span in:fade={{ duration: 250 }} out:fade={{ duration: 250 }} class="ml-3 text-xs font-semibold sm:text-sm">
        {$_("game.resultCopied")}
      </span>
    {/if}
    {#if showStats}
      <div transition:slide={{ duration: 300 }} class="mt-4 rounded-xl p-6 py-0">
        <h3 class="mb-4 text-center text-lg font-bold sm:text-2xl">
          {$_("game.gameStats")}
        </h3>
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

{#if winState === "gaveUp"}
  <div class="mb-1 rounded-3xl bg-red-100 p-6 dark:bg-red-950 sm:mb-4 sm:p-6">
    <div class="relative overflow-hidden">
      <h2 class="mb-4 text-lg font-bold sm:text-2xl">
        <span class="mr-2 text-3xl sm:text-4xl">🏳️</span>
        {$_("game.gaveUp")}
        <span class="ml-2 text-3xl sm:text-4xl">🥲</span>
      </h2>
    </div>
    <div class="space-y-1 text-sm sm:space-y-3 sm:text-base">
      <p>
        <span class="mr-2">❌</span>
        {$_("game.secretWordWouldHaveBeen")}
        <span class="mx-1 font-bold text-red-800 dark:text-red-300">{decodeB64word(secretWord)}</span>
      </p>
      <p class="flex items-center">
        <span class="mr-2">🔢</span>
        {$_("game.guessesUsedTotal")}
        <span class="mx-1 font-bold">{guesses.length}</span>
        {$_("game.usedGuesses")}
      </p>
      <p class="flex items-center">
        <span class="mr-2">💡</span>
        {$_("game.hintsUsedTotal")}
        <span class="mx-1 font-bold">{hintsUsed}</span>
        {$_("game.hintsWord")}
      </p>
      <p>
        <span class="mr-2">🔍</span>
        {$_("game.seeNearestWords")}
        <a
          href={`/nearby_1k/${secretWord}`}
          class="font-semibold underline transition-colors duration-200 ease-in-out hover:text-red-600 dark:hover:text-red-400"
          >{$_("game.here")}</a
        >
      </p>
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {$_("game.continueGuessing")}
      </p>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <button
        class="rounded-full bg-red-400 px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800 sm:text-base"
        on:click={displayCopiedText}
        use:copy={getClipboardContent(winState, gameNumber, guesses, hintsUsed)}
      >
        {$_("game.shareResult")}
      </button>
      <button
        class="rounded-full bg-red-400 px-4 py-2 text-sm text-white transition-colors duration-200 ease-in-out hover:bg-red-500 dark:bg-red-700 dark:hover:bg-red-800 sm:text-base"
        on:click={toggleStats}
      >
        {showStats ? $_("stats.hideStats") : $_("stats.showStats")}
      </button>
    </div>
    {#if displayCopied}
      <span in:fade={{ duration: 250 }} out:fade={{ duration: 250 }} class="ml-3 text-xs font-semibold sm:text-sm">
        {$_("game.resultCopied")}
      </span>
    {/if}
    {#if showStats}
      <div transition:slide={{ duration: 300 }} class="mt-4 rounded-xl bg-red-200 p-6 py-4 dark:bg-red-900">
        <h3 class="mb-4 text-center text-lg font-bold sm:text-2xl">
          {$_("game.gameStats")}
        </h3>
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
