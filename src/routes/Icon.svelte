<script lang="ts">
	import { setFocus } from '$lib/util/ui';

	export let url: string;
	export let id: string;
	export let iconName: string;
</script>

<div class="relative">
	<img
		class="w-[100px]"
		src={url}
		alt=""
		on:dragstart|preventDefault
		on:dblclick={() => {
			setFocus(id);
		}}
	/>
	<p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-white">{iconName}</p>
</div>
