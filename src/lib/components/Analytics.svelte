<script context="module" lang="ts">
  declare const gtag: (...args: any[]) => void;
</script>

<script lang="ts">
  import { page } from "$app/stores";
  import { currentConfig } from '$lib/config/language';

  $: {
    if (typeof gtag !== "undefined") {
      gtag("config", currentConfig.gaId, {
        page_title: document.title,
        page_path: $page.url.pathname,
      });
    }
  }
</script>

<svelte:head>
  <script async src="https://www.googletagmanager.com/gtag/js?id={currentConfig.gaId}">
  </script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag("js", new Date());
    gtag("config", "{currentConfig.gaId}");
  </script>
</svelte:head>
