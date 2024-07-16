<!-- src/lib/Navbar.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { theme, isDarkMode } from '$stores/theme';
	import { IconButton, Modal } from '$components';
	import { openModal } from '$stores/infoModal';

	const toggleTheme = () => {
		theme.update((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
	};

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
	class="mx-auto flex w-full max-w-3xl items-center justify-between px-4 pb-2 pt-4 text-menu-item-light selection:bg-menu-item-light selection:text-white dark:text-menu-item-dark dark:selection:bg-black dark:selection:text-menu-item-light sm:pb-8 sm:pt-6"
>
	<h1 class="font-PurplePurse text-4xl sm:text-5xl">Semanttuli</h1>
	<nav>
		<div class="flex items-center gap-8 sm:gap-10">
			<IconButton iconName="info" width="32px" height="32px" clickHandler={openModal} />

			{#if themeLoaded}
				<IconButton
					iconName={currentTheme ? 'sun' : 'moon'}
					buttonClass="bg-transparent p-0"
					iconClass="text-[#7F7C82] hover:text-gray-400 dark:text-yellow-400 dark:hover:text-yellow-500 transition-colors duration-250 ease-in-out"
					width="32px"
					height="32px"
					clickHandler={toggleTheme}
				/>
			{:else}
				<div class="w-[32px] h-[32px]"></div>
			{/if}
		</div>
	</nav>
</header>
<Modal />
