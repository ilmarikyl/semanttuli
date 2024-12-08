<script>
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { decodeB64word } from "$lib/utils/utils";
  import { Spinner } from "$components";
  import { _ } from "svelte-i18n";

  let isPending = false;
  const { wordB64 } = $page.params;

  /** @type {{neighbor: string, similarity: number, percentile: number}[]} */
  let closestWords = [];

  async function fetchNearby1k() {
    isPending = true;
    try {
      const response = await fetch(`/api/nearby_1k/${wordB64}`);
      if (response.ok) {
        const data = await response.json();
        closestWords = data;
      } else {
        console.error("Failed to fetch nearby words. Status:", response.status);
      }
    } catch (error) {
      console.error("Error fetching nearby words:", error);
    } finally {
      isPending = false;
    }
  }

  onMount(() => {
    fetchNearby1k();
  });
</script>

<div class="mb-4 rounded px-2 pb-4 pt-6">
  <a
    href="/"
    class="font-semibold text-highlight-light no-underline transition-colors duration-200 ease-in-out hover:text-highlight-hover-light dark:text-highlight-dark dark:hover:text-highlight-hover-dark"
    >{$_("game.backToGame")}</a
  >
  <h1 class="text-md font-rubik my-4 sm:text-xl">
    {$_("nearestWords.title", { values: { word: decodeB64word(wordB64) } })}
  </h1>

  {#if isPending}
    <div class="flex items-center justify-center">
      <Spinner />
    </div>
  {:else if closestWords.length > 0}
    <table class="font-base all-guesses w-full rounded-b-3xl text-sm sm:text-base">
      <thead>
        <tr class="bg-[#dad3f1] dark:bg-[#201029]">
          <th class="rounded-tl-2xl py-2">{$_("nearestWords.rank")}</th>
          <th style="text-align: left;">{$_("nearestWords.word")}</th>
          <th class="rounded-tr-2xl" style="text-align: left;">{$_("nearestWords.points")}</th>
        </tr>
      </thead>
      <tbody>
        {#each closestWords as word (word.neighbor)}
          <tr>
            <td style="text-align: center;">
              {1000 - word.percentile}
            </td>

            <td>
              {word.neighbor}
            </td>

            <td class="font-semibold text-blue-500">{word.similarity}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p>{$_("errors.unexpectedError")}</p>
  {/if}
</div>

<style>
  .all-guesses tr:first-child td {
    padding-top: 0.3rem;
  }
</style>
