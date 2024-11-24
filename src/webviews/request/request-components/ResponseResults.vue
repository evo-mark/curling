<template>
	<div>
		{{ results }}
		<div class="flex justify-end">
			<div>
				<vscode-button @click="emit('clear')">Clear Results</vscode-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { VscodeButton } from "@vscode-elements/elements";

const emit = defineEmits(["clear"]);
const { results } = defineProps({
	results: {
		type: Array,
		default: () => [],
	},
});
</script>
