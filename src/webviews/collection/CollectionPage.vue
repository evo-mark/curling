<template>
	<main v-if="isHydrated" class="container mx-auto py-4">Collection</main>
</template>

<script setup>
import { provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit";
import { toRaw } from "vue";
import { vscode } from "../utils";
import { useState } from "../composables";

provideVSCodeDesignSystem();

const { path, request, collection, isHydrated } = useState("collectionPage", {
	path: null,
	collection: null,
});

const onSave = () => {
	vscode.postAndReceive("update", { path: path.value, collection: collection.value }).then((res) => {
		path.value = res.path;
	});
};
</script>
