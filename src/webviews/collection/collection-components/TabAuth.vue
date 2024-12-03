<template>
	<vscode-tab-panel>
		<p class="my-4">
			Auth settings for the collection will apply to any requests with the 'inherit' option selected in their own
			auth settings.
		</p>
		<p>Auth Type</p>
		<SingleSelect v-model="modelValue.type" class="w-40" :items="authTypes" />
		<!-- BASIC AUTH -->
		<div v-if="modelValue.type === 'basic'" class="py-4">
			<div class="mb-4">
				<p>Username</p>
				<TextField v-model="modelValue.username" />
			</div>
			<div>
				<p>Password</p>
				<TextField v-model="modelValue.password" type="password" placeholder="Leave blank to keep the same" />
			</div>
		</div>
		<!-- BEARER TOKEN -->
		<div v-else-if="modelValue.type === 'bearer'" class="py-4">
			<div>
				<p>Token</p>
				<Password v-model="modelValue.token" />
			</div>
		</div>
		<!-- NO AUTH -->
		<div v-else class="h-40"></div>
	</vscode-tab-panel>
</template>

<script setup>
import SingleSelect from "../../components/input/SingleSelect.vue";
import TextField from "../../components/input/Text.vue";
import Password from "../../components/input/Password.vue";
import { VscodeTabPanel } from "@vscode-elements/elements";

const modelValue = defineModel({
	type: Object,
	default: () => ({}),
});

const authTypes = [
	{
		value: "none",
		label: "None",
	},
	{
		value: "basic",
		label: "Basic Auth",
	},
	{
		value: "bearer",
		label: "Bearer Token",
	},
];
</script>
