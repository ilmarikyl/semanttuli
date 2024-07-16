<script>
	import { fade } from 'svelte/transition';

	export let isPending = false;
	export let errorMessage = '';
</script>

<div class=" h-5 sm:4">
	{#if isPending}
		<div
			in:fade={{ duration: 2500 }}
			class="flex sm:text-xl gap-0.5 pl-4 pulse-text font-semibold font-Rubik"
		>
			<span>L</span>
			<span>a</span>
			<span>d</span>
			<span>a</span>
			<span>t</span>
			<span>a</span>
			<span>a</span>
			<span>n</span>
			<span>.</span>
			<span>.</span>
			<span>.</span>
		</div>
	{:else if errorMessage}
		<p
			in:fade={{ duration: 250 }}
			out:fade={{ duration: 500 }}
			class="text-sm sm:text-base text-red-500 pl-4 font-semibold"
		>
			{errorMessage}
		</p>
	{/if}
</div>

<style>
	.pulse-text span {
		animation: pulse-text 0.7s infinite alternate;
	}
	.pulse-text span:nth-child(2) {
		animation-delay: 0.1s;
	}
	.pulse-text span:nth-child(3) {
		animation-delay: 0.2s;
	}
	.pulse-text span:nth-child(4) {
		animation-delay: 0.3s;
	}
	.pulse-text span:nth-child(5) {
		animation-delay: 0.4s;
	}
	.pulse-text span:nth-child(6) {
		animation-delay: 0.5s;
	}
	.pulse-text span:nth-child(7) {
		animation-delay: 0.6s;
	}
	.pulse-text span:nth-child(8) {
		animation-delay: 0.7s;
	}
	.pulse-text span:nth-child(9) {
		animation-delay: 0.8s;
	}
	.pulse-text span:nth-child(10) {
		animation-delay: 0.9s;
	}
	.pulse-text span:nth-child(11) {
		animation-delay: 1s;
	}

	@keyframes pulse-text {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.8);
		}
	}
</style>
