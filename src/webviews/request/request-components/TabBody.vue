<template>
	<vscode-tab-panel>
		<div class="flex justify-end pb-8 z-50">
			<SingleSelect v-model="modelValue.type" :items="bodyTypes" />
		</div>
		<div v-if="modelValue.type === 'Multipart Form'">
			<h3 class="font-bold mt-4 px-2.5 text-lg">Params</h3>
			<ParamTable v-model="modelValue.multipart.params" />
			<h3 class="font-bold mt-4 px-2.5 text-lg">Files</h3>
			<ParamTable v-model="modelValue.multipart.files" files />
		</div>
		<div v-else-if="modelValue.type === 'Form URL Encoded'">
			<ParamTable v-model="modelValue.urlEncoded" />
		</div>
		<div v-else-if="modelValue.type === 'JSON'">
			<CodeEditor v-model="modelValue.json" language="json" :dark="props.dark" />
		</div>
		<div v-else-if="modelValue.type === 'XML'">
			<CodeEditor v-model="modelValue.xml" language="xml" :dark="props.dark" />
		</div>
		<div v-else-if="modelValue.type === 'No Body'" class="py-10 flex justify-center items-center flex-col">
			<div>
				<i class="codicon codicon-circle-slash !text-5xl"></i>
			</div>
			<div>No body will be sent</div>
		</div>
		<div v-else class="h-40 flex justify-center items-center">Not implemented</div>
	</vscode-tab-panel>
</template>

<script setup>
import { VscodeTabPanel } from "@vscode-elements/elements";
import SingleSelect from "../../components/input/SingleSelect.vue";
import ParamTable from "../../components/ParamTable.vue";
import CodeEditor from "../../components/input/CodeEditor.vue";

const modelValue = defineModel({
	type: Object,
	required: true,
});

const props = defineProps({
	dark: {
		type: Boolean,
		default: false,
	},
});

const bodyTypes = ["Multipart Form", "Form URL Encoded", "JSON", "XML", "TEXT", "No Body"];
</script>
