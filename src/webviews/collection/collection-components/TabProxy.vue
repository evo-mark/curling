<template>
	<vscode-tab-panel>
		<div class="py-4">
			<p>Enabling proxy settings in a collection will overwrite any global proxy settings for Curling.</p>
		</div>
		<div class="flex gap-12">
			<div class="flex flex-col gap-4">
				<div>
					<vscode-checkbox
						:checked="modelValue.enable"
						label="Enable Proxy"
						@change="modelValue.enable = $event.target.checked"
					/>
				</div>
				<div>
					<p>Protocol</p>
					<SingleSelect
						v-model="modelValue.protocol"
						:items="['HTTP', 'HTTPS']"
						:disabled="!modelValue.enable"
					/>
				</div>
				<div>
					<p>Host</p>
					<TextField v-model="modelValue.hostname" :disabled="!modelValue.enable" />
				</div>
				<div>
					<p>Port</p>
					<TextField v-model="modelValue.port" type="number" :disabled="!modelValue.enable" />
				</div>
			</div>
			<fieldset class="border border-gray-500/20 rounded p-4 mt-4 inline-block">
				<legend class="ml-4 px-4">Authentication</legend>
				<div class="flex flex-col gap-4">
					<div>
						<vscode-checkbox
							label="Enable Auth"
							:checked="modelValue.auth"
							:disabled="!modelValue.enable"
							@change="modelValue.auth = $event.target.checked"
						/>
					</div>
					<div>
						<p>Username</p>
						<TextField v-model="modelValue.username" :disabled="!modelValue.enable" />
					</div>
					<div>
						<p>Password</p>
						<Password
							v-model="modelValue.password"
							placeholder="Leave blank to keep the same"
							:disabled="!modelValue.enable"
						/>
					</div>
				</div>
			</fieldset>
		</div>
	</vscode-tab-panel>
</template>

<script setup>
import { VscodeTabPanel, VscodeCheckbox } from "@vscode-elements/elements";
import SingleSelect from "../../components/input/SingleSelect.vue";
import TextField from "../../components/input/Text.vue";
import Password from "../../components/input/Password.vue";

const modelValue = defineModel({
	type: Object,
	default: () => ({}),
});
</script>
