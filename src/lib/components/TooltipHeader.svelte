<script lang="ts">
	import { Tooltip } from '$components';

	export let label: string;
	export let tooltip: string;
	export let extraClasses: string = '';
</script>

<th class={`text-left transition-colors ${extraClasses}`} style="text-align: center;">
	<div class="flex flex-row items-center justify-center">
		{label}
		<Tooltip title={tooltip}>
			<svg
				class="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				style="height: 1.2em;"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
					clip-rule="evenodd"
				/>
			</svg>
		</Tooltip>
	</div>
</th>
