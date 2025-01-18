<script lang="ts">
  import { _, locale } from "svelte-i18n";

  // Determine the current language
  $: currentLocale = $locale;
  console.log(currentLocale);
</script>

<footer class="mx-auto mt-6 w-full max-w-3xl px-4 py-2 text-center font-Rubik text-xs font-light sm:py-4 sm:text-base">
  <div>
    <a
      href="https://github.com/ilmarikyl/semanttuli"
      target="_blank"
      rel="noopener noreferrer"
      class="duration-250 font-semibold text-highlight-light no-underline transition-colors ease-in-out hover:text-highlight-hover-light dark:text-highlight-dark dark:hover:text-highlight-hover-dark"
      >Ilmari Kylliäinen</a
    >
    © 2025
    {#if currentLocale === "fi"}
      – {$_("footer.downloadAndroid")}
      <a
        href="https://play.google.com/store/apps/details?id=com.herokuapp.semanttuli.twa"
        target="_blank"
        rel="noopener noreferrer"
        class="duration-250 font-semibold text-highlight-light no-underline transition-colors ease-in-out hover:text-highlight-hover-light dark:text-highlight-dark dark:hover:text-highlight-hover-dark"
        >{$_("footer.playStore")}</a
      >.
    {/if}
  </div>
</footer>
