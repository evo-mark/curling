<template>
	<vscode-tab-panel>
		<div class="grid gap-4 pt-4">
			<p>These settings will be used by all requests in the collection unless specifically disabled.</p>
			<div>
				<p>Request Type</p>
				<vscode-radio-group v-model="modelValue.requestType">
					<vscode-radio
						label="HTTP"
						name="request-type"
						value="http"
						:checked="modelValue.requestType === 'http'"
					></vscode-radio>
				</vscode-radio-group>
			</div>
			<div>
				<p>Base URL</p>
				<InputText
					v-model="modelValue.baseUrl"
					placeholder="Enter absolute URL, e.g. https://evomark.co.uk/api"
					class="w-96"
				/>
			</div>
		</div>
	</vscode-tab-panel>
</template>

<script setup>
import { VscodeRadioGroup, VscodeRadio } from "@vscode-elements/elements";
import InputText from "../../components/input/Text.vue";

const modelValue = defineModel({
	type: Object,
	default: () => ({}),
});
</script>
