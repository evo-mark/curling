<template>
	<vscode-single-select :value="modelValue" @change="onChange">
		<template v-for="option in props.items">
			<vscode-option v-if="hasObjectOptions" :value="option.value" :selected="modelValue === option.value">{{
				props.noFormatLabels ? option.label : startCase(option.label)
			}}</vscode-option>
			<vscode-option v-else :value="option" :selected="modelValue === option">{{
				props.noFormatLabels ? option : startCase(option)
			}}</vscode-option>
		</template>
	</vscode-single-select>
</template>

<script setup>
import { VscodeSingleSelect, VscodeOption } from "@vscode-elements/elements";
import { computed } from "vue";
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

const hasObjectOptions = computed(() => props.items.every((item) => typeof item === "object"));
</script>
