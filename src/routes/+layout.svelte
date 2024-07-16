<script>
	import '../app.css';
	import { Navbar, Footer } from '$components';
</script>

<svelte:head>
	<style>
		html[data-theme='dark'] {
			color-scheme: dark;
		}
		html[data-theme='light'] {
			color-scheme: light;
		}
	</style>
	<script>
		// Detect the initial theme and set it before page load
		(() => {
			const initialTheme =
				localStorage.getItem('theme') ||
				(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
			document.documentElement.classList.toggle('dark', initialTheme === 'dark');
			document.documentElement.setAttribute('data-theme', initialTheme);
		})();
	</script>
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-bg-light text-text-light transition-colors duration-500 ease-in-out dark:bg-bg-dark dark:text-text-dark"
>
	<Navbar />

	<div class="mx-auto w-full max-w-3xl flex-grow px-1 font-Rubik sm:px-4">
		<slot />
	</div>

	<Footer />
</div>

<style>
	:global(html, body) {
		height: 100%;
	}

	:global(#svelte) {
		height: 100%;
	}
</style>
