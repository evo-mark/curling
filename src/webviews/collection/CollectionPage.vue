<template>
	<main v-if="isHydrated" class="container mx-auto py-4">
		<vscode-tabs
			panel
			:selected-index="currentTab"
			:style="{
				'--vscode-panel-background': 'transparent',
			}"
			@vsc-tabs-select="onTabSelect"
		>
			<vscode-tab-header slot="header" :active="currentTab === 0">Globals</vscode-tab-header>
			<TabGlobals v-model="collection.globals" />
			<vscode-tab-header slot="header" :active="currentTab === 1">Headers</vscode-tab-header>
			<TabHeaders v-model="collection.headers" />
			<vscode-tab-header slot="header" :active="currentTab === 2">Auth</vscode-tab-header>
			<TabAuth v-model="collection.auth" :dark="isDark" />
			<vscode-tab-header slot="header" :active="currentTab === 3">Scripts</vscode-tab-header>
			<TabScripts v-model="collection.scripts" :dark="isDark" />
			<vscode-tab-header slot="header" :active="currentTab === 4">Proxy</vscode-tab-header>
			<TabProxy v-model="collection.proxy" />
			<vscode-tab-header slot="header" :active="currentTab === 5">Secrets</vscode-tab-header>
			<TabSecrets v-model="collection.secrets" />
		</vscode-tabs>
		<div class="flex justify-end mt-8">
			<vscode-button @click="onSave">Update Collection</vscode-button>
		</div>
	</main>
	<div v-else>No Collection</div>
</template>

<script setup>
import { provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit";
import { ref } from "vue";
import { vscode } from "../utils";
import { useState } from "../composables";
import { TabHeaders, TabAuth, TabScripts, TabProxy, TabSecrets, TabGlobals } from "./collection-components";
import { deepToRaw } from "../helpers";

provideVSCodeDesignSystem();

const currentTab = ref(0);
const onTabSelect = ($event) => {
	currentTab.value = $event.detail.selectedIndex;
};

const { path, collection, isDark, isHydrated } = useState("collectionPage", {
	path: null,
	collection: null,
});

const onSave = () => {
	vscode.post("update", { collection: deepToRaw(collection.value) });
};
</script>
