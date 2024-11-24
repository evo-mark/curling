<template>
	<vscode-single-select :value="modelValue" @change="onChange">
		<vscode-option v-for="option in props.items" :value="option" :selected="modelValue === option">{{
			props.noFormatLabels ? option : startCase(option)
		}}</vscode-option>
	</vscode-single-select>
</template>

<script setup>
import { VscodeSingleSelect, VscodeOption } from "@vscode-elements/elements";
import startCase from "lodash.startcase";

const modelValue = defineModel({
	type: [String, Number],
	default: "",
});

const props = defineProps({
	items: {
		type: Array,
		default: () => [],
	},
	noFormatLabels: {
		type: Boolean,
		default: false,
	},
});

const onChange = ($event) => {
	modelValue.value = $event.target.value;
};
</script>
