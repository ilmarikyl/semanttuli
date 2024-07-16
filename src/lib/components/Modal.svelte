<script lang="ts">
	import { closeModal, isModalOpen } from '$stores/infoModal';
	import { gameState } from '$stores/gameState';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import { Accordion } from '$components';
	import { gameDescription, faqItems } from '$lib/data/infoTexts';
	import { wrapWordsInBold } from '$lib/utils/utils';

	let visible = false;

	$: yesterdayWord = $gameState.yesterdayWord;
	$: yesterdayNearby10 = $gameState.yesterdayNearby10;

	// Reactive processed FAQ items
	$: processedFaqItems = faqItems.map((item) => ({
		...item,
		content: item.content
			.replace(
				'<YESTERDAY_WORD>',
				`<span style="font-weight: 500">${yesterdayWord}</span>` || 'N/A'
			)
			.replace(
				'<YESTERDAY_NEARBY_10>',
				yesterdayNearby10.length > 0 ? wrapWordsInBold(yesterdayNearby10) : 'N/A'
			)
	}));

	$: visible = $isModalOpen;

	const handleBackdropKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			closeModal();
		}
	};

	const handleBackdropClick = (event: MouseEvent) => {
		// Ensure only the backdrop itself closes the modal
		if ((event.target as HTMLElement).id === 'modal-backdrop') {
			closeModal();
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			closeModal();
		}
	};

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	$: if (visible) {
		tick().then(() => {
			const modal = document.getElementById('modal-content');
			if (modal) {
				modal.focus();
			}
		});
	}
</script>

{#if visible}
	<div
		id="modal-backdrop"
		role="button"
		tabindex="0"
		aria-label="Close modal backdrop"
		class="backdrop-cursor fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 font-Rubik"
		on:click={handleBackdropClick}
		on:keydown={handleBackdropKeydown}
	>
		<div class="relative m-3">
			<button
				class="close-button absolute z-50 mr-2 text-gray-500 transition-colors duration-200 ease-in-out hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
				aria-label="Close modal"
				on:click={closeModal}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			</button>
			<div
				class="modal-wrapper relative w-full max-w-2xl overflow-hidden rounded-2xl bg-modal-bg-light pt-0 shadow-lg dark:bg-modal-bg-dark"
			>
				<div id="modal-content" role="document" class="p-1 focus:outline-none" tabindex="-1">
					<h2 class="my-4 px-3 text-base sm:px-4 sm:text-xl">
						<span
							class="font-PurplePurse text-2xl font-medium dark:font-normal sm:text-3xl sm:font-semibold"
							>Semanttuli</span
						> — Selvitä salainen sana
					</h2>

					<div class="max-h-[75vh] overflow-y-auto px-3 sm:px-4">
						<h3 class="mb-2 text-base sm:text-lg font-semibold">Ohjeet pelaamiseen</h3>
						<div class="flex flex-col gap-4">
							{#each gameDescription as paragraph}
								<p class="text-sm sm:text-base">{@html paragraph}</p>
							{/each}
						</div>

						<hr class="my-4" />
						<h2 class="mb-5 text-lg sm:text-xl">Kysymyksiä ja vastauksia</h2>

						<Accordion items={processedFaqItems} />
					</div>

					<div class="px-3 sm:px-4">
						<hr />
						<p class="py-3 text-sm sm:py-4 sm:text-base">
							<a
								href="/yksityisyyskaytanto"
								class="text-highlight-light transition-colors duration-200 ease-in-out hover:text-highlight-hover-light dark:text-white"
								on:click={() => closeModal()}
							>
								Yksityisyyskäytäntö
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
		top: -10px;
		right: -15px;
		z-index: 50;
		padding: 0.5rem;
		background-color: white;
		border-radius: 50%;
	}
</style>
