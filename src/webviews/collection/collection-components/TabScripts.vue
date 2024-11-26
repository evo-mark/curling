<template>
	<vscode-tab-panel>
		<p>Pre Request</p>
		<CodeEditor
			v-model="modelValue.pre"
			v-model:instance="preInstance"
			language="javascript"
			:dark="props.dark"
			:placeholder="prePlaceholder"
		/>
		<p>Pre Request Error</p>
		<CodeEditor
			v-model="modelValue.preError"
			language="javascript"
			:dark="props.dark"
			:placeholder="preErrorPlaceholder"
		/>
		<vscode-divider />
		<p>Post Response</p>
		<CodeEditor v-model="modelValue.post" language="javascript" :dark="props.dark" :placeholder="postPlaceholder" />
		<p>Post Response Error</p>
		<CodeEditor
			v-model="modelValue.postError"
			language="javascript"
			:dark="props.dark"
			:placeholder="postErrorPlaceholder"
		/>
	</vscode-tab-panel>
</template>

<script setup>
import { VscodeDivider, VscodeTabPanel } from "@vscode-elements/elements";
import CodeEditor from "../../components/input/CodeEditor.vue";
import { ref, watch } from "vue";

const modelValue = defineModel({
	type: Object,
	default: () => ({
		pre: "",
		preError: "",
		post: "",
		postError: "",
	}),
});

const props = defineProps({
	dark: {
		type: Boolean,
		default: false,
	},
});

const onInstanceMounted = (instance) => {
	if (instance) {
		let isFiltering = false;
		instance.getSession().on("changeAnnotation", function () {
			if (isFiltering) return;

			isFiltering = true;
			const annotations = instance.getSession().getAnnotations();
			const filtered = annotations.filter(
				(annotation) => !annotation.raw.includes("Missing name in function declaration.")
			);
			instance.getSession().setAnnotations(filtered);
			isFiltering = false;
		});
	}
};

const preInstance = ref(null);
watch(preInstance, onInstanceMounted);
const prePlaceholder = `function (config) {
    // Do something before request is sent
    return config;
}`;

const preErrorInstance = ref(null);
watch(preErrorInstance, onInstanceMounted);
const preErrorPlaceholder = `function (error) {
    // Do something with request error
    return Promise.reject(error);
}`;

const postInstance = ref(null);
watch(postInstance, onInstanceMounted);
const postPlaceholder = `function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}`;

const postErrorInstance = ref(null);
watch(postErrorInstance, onInstanceMounted);
const postErrorPlaceholder = `function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
}`;
</script>
