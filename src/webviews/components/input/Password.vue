<template>
	<vscode-textfield :value="modelValue" :type="type" @input="onInput">
		<button slot="content-after" class="flex items-center mr-2" @click="show = !show">
			<i v-if="show" class="codicon codicon-eye-closed"></i>
			<i v-else class="codicon codicon-eye"></i>
		</button>
	</vscode-textfield>
</template>

<script setup>
import { VscodeTextfield } from "@vscode-elements/elements";
import { computed, ref } from "vue";

const modelValue = defineModel({
	type: [String, Number],
	default: null,
});

const onInput = ($event) => {
	modelValue.value = $event.target.value;
};

const show = ref(false);
const type = computed(() => (show.value ? "text" : "password"));
</script>
