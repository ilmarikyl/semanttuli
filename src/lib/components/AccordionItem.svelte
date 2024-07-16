<script lang="ts">
	export let title: string;
	export let content: string;
	let isOpen = false;

	const toggle = () => {
		isOpen = !isOpen;
	};
</script>

<button
	class="accordion w-full bg-accordion-item-bg-light p-3 text-left dark:bg-accordion-item-bg-dark sm:p-4 {isOpen
		? 'active'
		: ''}"
	on:click={toggle}
>
	{title}
</button>

<div
	class="overflow-hidden"
	style="max-height: {isOpen ? '250px' : '0'}; transition: max-height {isOpen
		? '0.4s'
		: '0.2s'} ease-in-out;"
>
	<div class="p-3 sm:p-4">{@html content}</div>
</div>

<style>
	.accordion:first-of-type {
		border-radius: 15px 15px 0 0;
	}

	.accordion:nth-last-of-type(1) {
		border-radius: 0 0 15px 15px;
	}

	.accordion.active:nth-last-of-type(1) {
		border-radius: 0;
	}

	.accordion:after {
		content: '\002B';
		float: right;
		margin-left: 5px;
	}

	.accordion.active:after {
		content: '\2212';
	}
</style>
