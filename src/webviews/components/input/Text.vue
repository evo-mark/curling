<template>
	<vscode-textfield class="px-2 py-0.5" :value="modelValue" @input="onInput"></vscode-textfield>
</template>

<script setup>
import { VscodeTextfield } from "@vscode-elements/elements";

const modelValue = defineModel({
	type: [String, Number],
	default: null,
});

const onInput = ($event) => {
	modelValue.value = $event.target.value;
};
</script>
