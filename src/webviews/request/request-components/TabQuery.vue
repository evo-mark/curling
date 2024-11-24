<template>
	<vscode-tab-panel>
		<ParamTable v-model="modelValue" />
	</vscode-tab-panel>
</template>

<script setup>
import { VscodeTabPanel } from "@vscode-elements/elements";
import ParamTable from "../../components/ParamTable.vue";

const modelValue = defineModel({
	type: Array,
	required: true,
});
</script>
