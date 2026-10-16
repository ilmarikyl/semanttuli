<script lang="ts">
  import { onMount, tick } from "svelte";
  import { get } from "svelte/store";
  import { theme, isDarkMode } from "$stores/theme";
  import { IconButton, LeaderboardModal, Modal } from "$components";
  import { openModal } from "$stores/infoModal";
  import { expandPageLeaderboard, openLeaderboard } from "$stores/leaderboardModal";
  import { gameState } from "$stores/gameState";
  import { _ } from "svelte-i18n";

  const toggleTheme = () => {
    theme.update((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  async function showLeaderboard() {
    const { winState } = get(gameState);
    const finished = winState === "won" || winState === "gaveUp";
    const inline = document.getElementById("daily-leaderboard");
    if (finished && inline) {
      expandPageLeaderboard();
      await tick();
      inline.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    openLeaderboard();
  }

  let themeLoaded = false;
  let currentTheme: boolean;

  onMount(() => {
    const unsubscribe = isDarkMode.subscribe((value) => {
      currentTheme = value;
      themeLoaded = true;
    });

    return unsubscribe;
  });
</script>

<header
  class="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pb-0 pt-4 text-menu-item-light selection:bg-menu-item-light selection:text-white dark:text-menu-item-dark dark:selection:bg-black dark:selection:text-menu-item-light sm:pb-8 sm:pt-6"
>
  <h1 class="whitespace-nowrap font-PurplePurse text-[2rem] min-[380px]:text-4xl sm:text-5xl">{$_("navbar.title")}</h1>
  <nav>
    <div class="flex shrink-0 items-center gap-3 sm:gap-8">
      <IconButton
        iconName="info"
        width="32px"
        height="32px"
        clickHandler={openModal}
        ariaLabel={$_("navbar.openInfo")}
      />

      <IconButton
        iconName="podium"
        width="32px"
        height="32px"
        clickHandler={showLeaderboard}
        ariaLabel={$_("navbar.openLeaderboard")}
      />

      {#if themeLoaded}
        <IconButton
          iconName={currentTheme ? "sun" : "moon"}
          buttonClass="bg-transparent p-0"
          iconClass="text-[#7F7C82] hover:text-gray-400 dark:text-yellow-400 dark:hover:text-yellow-500 transition-colors duration-250 ease-in-out"
          width="32px"
          height="32px"
          clickHandler={toggleTheme}
          ariaLabel={$_(currentTheme ? "navbar.toggleTheme.light" : "navbar.toggleTheme.dark")}
        />
      {:else}
        <div class="w-[32px] h-[32px]"></div>
      {/if}
    </div>
  </nav>
</header>
<Modal />
<LeaderboardModal />
