<script lang="ts">
	import { fly } from 'svelte/transition';
	import { hideKeyboard } from '$stores/keyboard';

	export let isPending: boolean;
	export let addLetter: (letter: string) => void;
	export let removeLetter: () => void;
	export let handleSubmit: () => void;
	export let clearAllLetters: () => void; // New function to clear all letters

	const row1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'];
	const row2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ö', 'ä'];
	const row3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm', '-'];

	let activeBubble: string | null = null;
	let backspaceTimer: ReturnType<typeof setTimeout> | null = null;
	let isBackspaceHeld = false;

	function handleKeyPress(letter: string) {
		addLetter(letter);
		activeBubble = letter;
		setTimeout(() => {
			activeBubble = null;
		}, 225); // Bubble visible for 225ms
	}

	function handleBackspaceDown() {
		if (isPending) return;

		removeLetter();
		isBackspaceHeld = true;
		backspaceTimer = setTimeout(() => {
			if (isBackspaceHeld) {
				clearAllLetters();
			}
		}, 500); // Hold for 500ms to clear all
	}

	function handleBackspaceUp() {
		isBackspaceHeld = false;
		if (backspaceTimer) {
			clearTimeout(backspaceTimer);
			backspaceTimer = null;
		}
	}
</script>

<div
	class="fixed bottom-0 left-0 right-0 z-50 mx-auto flex w-full max-w-[500px] flex-col justify-center gap-1 rounded-t-lg bg-light-purple-100 px-[4px] pb-4 pt-2 dark:bg-gray-700"
	transition:fly={{ y: 300, duration: 300 }}
>
	<div class="flex justify-start gap-[2px]">
		{#each row1 as key}
			<button
				class="kb-btn-letter relative bg-light-purple-400 dark:bg-gray-800"
				on:mousedown={() => handleKeyPress(key)}
				on:touchstart|preventDefault={() => handleKeyPress(key)}
				disabled={isPending}
			>
				{key}
				{#if activeBubble === key}
					<div
						class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] transform rounded-full bg-gray-800 px-3 py-1 text-lg font-bold text-white dark:bg-dark-purple-400"
						transition:fly={{ y: 20, duration: 100 }}
					>
						{key}
					</div>
				{/if}
			</button>
		{/each}
		<button
			class="kb-btn min-w-[45px] max-w-[75px] bg-highlight-light text-white dark:bg-dark-purple-200"
			on:mousedown={handleBackspaceDown}
			on:mouseup={handleBackspaceUp}
			on:mouseleave={handleBackspaceUp}
			on:touchstart|preventDefault={handleBackspaceDown}
			on:touchend|preventDefault={handleBackspaceUp}
			disabled={isPending}>⌫</button
		>
	</div>
	<div class="ml-2 flex justify-start gap-[2px]">
		{#each row2 as key}
			<button
				class="kb-btn-letter relative bg-light-purple-400 dark:bg-gray-800"
				on:mousedown={() => handleKeyPress(key)}
				on:touchstart|preventDefault={() => handleKeyPress(key)}
				disabled={isPending}
			>
				{key}
				{#if activeBubble === key}
					<div
						class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] transform rounded-full bg-gray-800 px-3 py-1 text-lg font-bold text-white dark:bg-dark-purple-400"
						transition:fly={{ y: 20, duration: 100 }}
					>
						{key}
					</div>
				{/if}
			</button>
		{/each}
	</div>
	<div class="flex justify-start gap-[2px]">
		<button
			class="kb-btn kb-btn-hide-kb min-w-[30px] bg-highlight-light text-white dark:bg-dark-purple-200"
			on:click={hideKeyboard}
			disabled={isPending}
		>
			↓
		</button>
		{#each row3 as key}
			<button
				class="kb-btn-letter relative bg-light-purple-400 dark:bg-gray-800"
				on:mousedown={() => handleKeyPress(key)}
				on:touchstart|preventDefault={() => handleKeyPress(key)}
				disabled={isPending}
			>
				{key}
				{#if activeBubble === key}
					<div
						class="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[150%] transform rounded-full bg-gray-800 px-3 py-1 text-lg font-bold text-white dark:bg-dark-purple-400"
						transition:fly={{ y: 20, duration: 100 }}
					>
						{key}
					</div>
				{/if}
			</button>
		{/each}
		<div class="flex flex-grow justify-end">
			<button
				on:click={handleSubmit}
				class="kb-btn max-w-[110px] bg-highlight-light text-white dark:bg-dark-purple-200"
				disabled={isPending}>Arvaa</button
			>
		</div>
	</div>
</div>

<style>
	.kb-btn {
		@apply h-16 flex-1 rounded-md p-1 text-base;
	}

	.kb-btn-letter {
		@apply kb-btn max-w-[35px] text-white;
	}

	.kb-btn-hide-kb {
		@apply kb-btn max-w-[40px];
	}

	@media (min-width: 640px) {
		.kb-btn-letter {
			@apply max-w-[45px];
		}
	}
</style>
