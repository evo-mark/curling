<template>
	<main v-if="isHydrated" class="container mx-auto py-4">
		<div class="flex items-stretch mb-4">
			<Textfield v-model="request.url" class="w-full">
				<SingleSelect v-model="request.method" slot="content-before" class="w-24" :items="requestMethods" />
				<vscode-button slot="content-after" class="h-6 flex items-center" @click="onSendRequest">
					<i class="codicon codicon-send"></i>
				</vscode-button>
			</Textfield>
		</div>
		<vscode-split-layout>
			<div slot="start" class="split-layout-content pr-4">
				<vscode-tabs
					panel
					:selected-index="currentTab"
					:style="{
						'--vscode-panel-background': 'transparent',
					}"
					@vsc-tabs-select="onTabSelect"
				>
					<vscode-tab-header slot="header" :active="currentTab === 0">Query</vscode-tab-header>
					<TabQuery v-model="request.query" />
					<vscode-tab-header slot="header" :active="currentTab === 1">Body</vscode-tab-header>
					<TabBody v-model="request.body" :dark="isDark" />
					<vscode-tab-header slot="header" :active="currentTab === 2">Headers</vscode-tab-header>
					<TabHeaders v-model="request.headers" />
					<vscode-tab-header slot="header" :active="currentTab === 3">Auth</vscode-tab-header>
					<TabAuth v-model="request.auth" />
					<vscode-tab-header slot="header" :active="currentTab === 4">Scripts</vscode-tab-header>
					<TabScripts v-model="request.scripts" :dark="isDark" />
				</vscode-tabs>
				<div class="flex justify-end mt-8">
					<vscode-button @click="onSave">Update Request</vscode-button>
				</div>
			</div>
			<div slot="end" class="split-layout-content flex flex-col justify-center items-center">
				<ResponseLanding v-if="!results?.length" :os="os" @send="onSendRequest" />
				<ResponseResults v-else :results="results" @clear="onClearResults" />
			</div>
		</vscode-split-layout>
	</main>
</template>

<script setup>
import { provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit";
import {
	VscodeButton,
	VscodeSplitLayout,
	VscodeTabs,
	VscodeTabHeader,
} from "@vscode-elements/elements";
import { onMounted, ref } from "vue";
import { vscode } from "../utils";
import { useState } from "../composables";
import { deepToRaw } from "../helpers";
import Logo from "../components/Logo.vue";
import Textfield from "../components/Textfield.vue";
import SingleSelect from "../components/input/SingleSelect.vue";
import ResponseLanding from "./request-components/ResponseLanding.vue";
import ResponseResults from "./request-components/ResponseResults.vue";
import TabQuery from "./request-components/TabQuery.vue";
import TabBody from "./request-components/TabBody.vue";
import TabHeaders from "./request-components/TabHeaders.vue";
import TabAuth from "./request-components/TabAuth.vue";
import TabScripts from "../collection/collection-components/TabScripts.vue";

const currentTab = ref(0);
const resultsList = ref([]);
const loadedResult = ref(null);

const requestMethods = ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"];

provideVSCodeDesignSystem();

const onTabSelect = ($event) => {
	currentTab.value = $event.detail.selectedIndex;
};

const { path, request, collection, isHydrated, os, config, isDark } = useState("request", {
	path: null,
	collection: null,
	request: null,
});

const onSave = () => {
	vscode
		.postAndReceive("update", { request: deepToRaw(request.value), path: path.value, collection: collection.value })
		.then((res) => {
			path.value = res.path;
		});
};

const onSendRequest = () => {
	vscode
		.postAndReceive(
			"send",
			{
				requestSlug: request.value.slug,
				requestMethod: request.value.method,
				collectionSlug: collection.value,
			},
			{
				interval: 5000,
				timeout: 10000,
			}
		)
		.then((res) => {
			results.value.push(res);
		});
};

const onClearResults = () => {
	results.value = [];
};

onMounted(() => {
	document.addEventListener("keydown", (ev) => {
		const keyEvent = {
			altKey: ev.altKey,
			code: ev.code,
			ctrlKey: ev.ctrlKey,
			isComposing: ev.isComposing,
			key: ev.key,
			location: ev.location,
			metaKey: ev.metaKey,
			repeat: ev.repeat,
			shiftKey: ev.shiftKey,
		};
		vscode.post("keydown", keyEvent);
	});
});
</script>
