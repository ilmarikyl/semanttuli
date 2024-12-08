<script>
  import { _ as t } from "svelte-i18n";
  import { PrivacyPolicyHeader as TextHeader, PrivacyPolicySection as TextSection } from "$components";
</script>

<svelte:head>
  <title>{$t("privacy.title")} - {$t("navbar.title")}</title>
</svelte:head>

<div class="mb-4 rounded px-6 pb-8 pt-6 shadow-md">
  <a
    href="/"
    class="font-semibold text-highlight-light transition-colors duration-200 ease-in-out hover:text-highlight-hover-light dark:text-highlight-dark dark:hover:text-highlight-hover-dark"
    >⬅ {$t("game.backToGame")}</a
  >
  <TextHeader level={2} text={$t("privacy.title")} />

  <TextSection title="" content={$t("privacy.sections.intro")} />

  <TextSection title={$t("privacy.sections.commitmentTitle")} content={$t("privacy.sections.commitment")} />

  <TextSection title={$t("privacy.sections.collectedDataTitle")} content={$t("privacy.sections.collectedData")} />

  <TextSection title={$t("privacy.sections.logDataTitle")} content={$t("privacy.sections.logData")} />

  <TextSection title={$t("privacy.sections.cookiesTitle")} content={$t("privacy.sections.cookies")} />

  <TextSection title={$t("privacy.sections.contactTitle")} content={$t("privacy.sections.contact")} />
</div>
