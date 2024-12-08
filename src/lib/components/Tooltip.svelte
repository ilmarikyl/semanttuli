<script lang="ts">
  export let title: string = "";
  let isHovered: boolean = false;
  let x: number = 0;
  let y: number = 0;
  let tooltipContent: HTMLElement;

  function handleMouseOver(event: MouseEvent): void {
    isHovered = true;
    updatePosition(event.pageX, event.pageY);
  }

  function handleMouseMove(event: MouseEvent): void {
    updatePosition(event.pageX, event.pageY);
  }

  function handleMouseLeave(event: MouseEvent): void {
    if (tooltipContent && !tooltipContent.contains(event.relatedTarget as Node)) {
      isHovered = false;
    }
  }

  function updatePosition(pageX: number, pageY: number): void {
    x = pageX - 160;
    y = pageY - 95;
  }

  function handleClick(): void {
    isHovered = !isHovered;
    if (isHovered) {
      const trigger = event?.target as HTMLElement;
      const rect = trigger.getBoundingClientRect();
      updatePosition(rect.left + window.scrollX + rect.width / 2, rect.top + window.scrollY + rect.height);
    }
  }

  function handleFocus(event: FocusEvent): void {
    isHovered = true;
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    updatePosition(
      rect.left + window.scrollX + target.offsetWidth / 2,
      rect.top + window.scrollY + target.offsetHeight + 5
    );
  }

  function handleBlur(): void {
    isHovered = false;
  }
</script>

<button
  aria-describedby={isHovered ? 'tooltip' : undefined}
  on:mouseover={handleMouseOver}
  on:mouseleave={handleMouseLeave}
  on:mousemove={handleMouseMove}
  on:click={handleClick}
  on:keydown={(e) => e.key === "Enter" && handleClick()}
  on:focus={handleFocus}
  on:blur={handleBlur}
  class="relative inline-block border-none bg-transparent p-0"
>
  <slot />
</button>

{#if isHovered}
  <div
    bind:this={tooltipContent}
    id="tooltip"
    role="tooltip"
    class="absolute z-20 max-w-xs rounded border border-gray-300 bg-white p-2 text-sm font-normal text-black shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-white"
    style="top: {y}px; left: {x}px;"
    on:mouseover={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
    on:focus={handleFocus}
  >
    {title}
  </div>
{/if}
