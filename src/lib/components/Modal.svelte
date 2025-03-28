<script lang="ts">
  import { _ } from "svelte-i18n";
  import { closeModal, isModalOpen } from "$stores/infoModal";
  import { gameState } from "$stores/gameState";
  import { onMount } from "svelte";
  import { tick } from "svelte";
  import { Accordion } from "$components";
  import { getGameDescription, faqItems } from "$lib/data/infoTexts";
  import { wrapWordsInBold } from "$lib/utils/utils";

  let visible = false;

  $: yesterdayWord = $gameState.yesterdayWord;
  $: yesterdayNearby10 = $gameState.yesterdayNearby10;

  // Reactive processed FAQ items
  $: processedFaqItems = faqItems().map((item) => ({
    ...item,
    content: item.content
      .replace("<YESTERDAY_WORD>", `<span style="font-weight: 500">${yesterdayWord}</span>` || "N/A")
      .replace("<YESTERDAY_NEARBY_10>", yesterdayNearby10.length > 0 ? wrapWordsInBold(yesterdayNearby10) : "N/A"),
  }));
  $: visible = $isModalOpen;

  const handleBackdropKeydown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closeModal();
    }
  };

  const handleBackdropClick = (event: MouseEvent) => {
    // Ensure only the backdrop itself closes the modal
    if ((event.target as HTMLElement).id === "modal-backdrop") {
      closeModal();
    }
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      closeModal();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  });

  let showGradient = false;

  function handleScroll(event: Event) {
    const target = event.target as HTMLElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 20; // 20px threshold
    showGradient = !isAtBottom;

    if (target.scrollTop > 20) {
      showScrollIndicator = false;
    }
  }

  $: if (visible) {
    tick().then(() => {
      const modal = document.getElementById("modal-content");
      const scrollableArea = document.querySelector(".scrollable-content");

      if (modal) {
        modal.focus();
      }

      // Initialize scroll indicator
      const isDesktop = window.innerWidth >= 768;
      showScrollIndicator = !isDesktop;

      // Set up scroll listener
      if (scrollableArea) {
        scrollableArea.addEventListener("scroll", handleScroll);
        // Initial check
        handleScroll({ target: scrollableArea } as unknown as Event);
      }

      // Hide arrow after 7 seconds
      const timer = setTimeout(() => {
        showScrollIndicator = false;
      }, 7000);

      return () => {
        if (scrollableArea) {
          scrollableArea.removeEventListener("scroll", handleScroll);
        }
        clearTimeout(timer);
      };
    });
  }

  let showScrollIndicator = false;
</script>

{#if visible}
  <div
    id="modal-backdrop"
    role="button"
    tabindex="0"
    aria-label={$_("navbar.openInfo")}
    class="backdrop-cursor fixed inset-0 z-40 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 font-Rubik py-2 px-2"
    on:click={handleBackdropClick}
    on:keydown={handleBackdropKeydown}
  >
    <div class="relative w-full max-w-2xl">
      <button
        class="close-button absolute z-50 mr-2 text-gray-500 transition-colors duration-200 ease-in-out hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
        aria-label={$_("navbar.openInfo")}
        on:click={closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        class="modal-wrapper relative w-full overflow-hidden rounded-2xl bg-modal-bg-light pt-0 shadow-lg dark:bg-modal-bg-dark"
      >
        <div id="modal-content" role="document" class="p-1 focus:outline-none" tabindex="-1">
          <h2 class="my-4 px-3 text-base sm:px-4 sm:text-xl">
            <span class="font-PurplePurse text-2xl font-medium dark:font-normal sm:text-3xl sm:font-semibold"
              >{$_("navbar.title")}</span
            >
            — {$_("modal.title")}
          </h2>

          <div class="scrollable-content relative max-h-[65dvh] overflow-y-auto px-3 sm:px-4" on:scroll={handleScroll}>
            <h3 class="mb-2 text-base font-semibold sm:text-lg">{$_("modal.instructions")}</h3>
            <div class="flex flex-col gap-4">
              {#each getGameDescription() as paragraph}
                <p class="text-sm sm:text-base">{@html paragraph}</p>
              {/each}
            </div>

            <hr class="my-4" />
            <h2 class="mb-5 text-lg sm:text-xl">{$_("modal.faq")}</h2>

            <Accordion items={processedFaqItems} />
            <div class="h-8"></div>
          </div>

          {#if showGradient}
            <div class="gradient-overlay-container px-3 sm:px-4">
              <div class="gradient-overlay" />
            </div>
          {/if}

          {#if showScrollIndicator}
            <div class="scroll-indicator-arrow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-8 w-8 text-highlight-dark dark:text-highlight-light"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25a.75.75 0 01.75.75v16.19l6.22-6.22a.75.75 0 111.06 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 111.06-1.06l6.22 6.22V3a.75.75 0 01.75-.75z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {/if}

          <div class="px-3 sm:px-4">
            <hr />
            <p class="py-3 text-sm sm:py-4 sm:text-base">
              <a
                href="/yksityisyyskaytanto"
                class="text-highlight-light transition-colors duration-200 ease-in-out hover:text-highlight-hover-light dark:text-white"
                on:click={() => closeModal()}
              >
                {$_("privacy.title")}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop-cursor {
    cursor: default;
  }

  #modal-backdrop {
    animation: fadeIn 0.3s ease-in-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0rem;
    z-index: 50;
    padding: 0.5rem;
    background-color: white;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .scroll-indicator-arrow {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: rgba(0, 0, 0, 0.5);
    animation: bounce 2s infinite;
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateX(-50%) translateY(0);
    }
    40% {
      transform: translateX(-50%) translateY(-10px);
    }
    60% {
      transform: translateX(-50%) translateY(-5px);
    }
  }

  .modal-wrapper {
    position: relative;
    overflow: hidden;
    max-height: calc(100vh - 2rem);
    margin: 0 auto;
  }

  @supports (-webkit-touch-callout: none) {
    .modal-wrapper {
      /* Adjust for iOS safari's address bar and bottom bar */
      max-height: calc(100vh - 4rem);
      /* Add padding to ensure content is not hidden behind bottom bar */
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  .scrollable-content {
    position: relative;
    /* Ensure proper padding at the bottom for iOS */
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }

  .gradient-overlay-container {
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    margin-top: -40px;
    pointer-events: none;
    z-index: 10;
  }

  .gradient-overlay {
    height: 100%;
    background: linear-gradient(to bottom, rgba(var(--modal-bg-rgb), 0), rgb(var(--modal-bg-rgb)) 100%);
  }

  /* Update the background color variables to use RGB values */
  :root {
    --modal-bg-rgb: 255, 255, 255;
  }

  :global(.dark) {
    --modal-bg-rgb: 26, 26, 26;
  }
</style>
