<template>
	<v-ace-editor
		ref="editorRef"
		v-model:value="modelValue"
		:lang="props.language"
		:theme="props.dark ? 'github_dark' : 'chrome'"
		:min-lines="10"
		:max-lines="30"
		:options="{ useWorker: true }"
	/>
</template>

<script setup>
import { VAceEditor } from "vue3-ace-editor";
import ace from "ace-builds";
import { ref, onMounted, onUnmounted } from "vue";

import modeJavascriptUrl from "ace-builds/src-noconflict/mode-javascript?url";
ace.config.setModuleUrl("ace/mode/javascript", modeJavascriptUrl);

import modeJsonUrl from "ace-builds/src-noconflict/mode-json?url";
ace.config.setModuleUrl("ace/mode/json", modeJsonUrl);

import modeXmlUrl from "ace-builds/src-noconflict/mode-xml?url";
ace.config.setModuleUrl("ace/mode/xml", modeXmlUrl);

import themeChromeUrl from "ace-builds/src-noconflict/theme-chrome?url";
ace.config.setModuleUrl("ace/theme/chrome", themeChromeUrl);

import themeGithubDarkUrl from "ace-builds/src-noconflict/theme-github_dark?url";
ace.config.setModuleUrl("ace/theme/github_dark", themeGithubDarkUrl);

import workerJsonUrl from "ace-builds/src-noconflict/worker-json?url";
ace.config.setModuleUrl("ace/mode/json_worker", workerJsonUrl);

import workerXmlUrl from "ace-builds/src-noconflict/worker-xml?url";
ace.config.setModuleUrl("ace/mode/xml_worker", workerXmlUrl);

import workerJavascriptUrl from "ace-builds/src-noconflict/worker-javascript?url";
ace.config.setModuleUrl("ace/mode/javascript_worker", workerJavascriptUrl);

const editorRef = ref(null);
const modelValue = defineModel({
	type: String,
	default: "",
});

const instance = defineModel("instance", {
	type: Object,
	default: null,
});

const props = defineProps({
	dark: {
		type: Boolean,
		default: false,
	},
	language: {
		type: String,
		default: "json",
		validator: (v) => ["json", "xml", "javascript"].includes(v),
	},
});

onMounted(() => {
	instance.value = editorRef.value.getAceInstance();
});
onUnmounted(() => {
	instance.value = null;
});
</script>
