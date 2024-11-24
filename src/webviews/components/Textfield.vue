<template>
	<vscode-textfield :value="modelValue" @input="onInput">
		<slot></slot>
	</vscode-textfield>
</template>

<script setup>
import { VscodeTextfield } from "@vscode-elements/elements";

const modelValue = defineModel({
	type: String,
	default: "",
});

const onInput = ($event) => {
	modelValue.value = $event.target.value;
};
</script>
