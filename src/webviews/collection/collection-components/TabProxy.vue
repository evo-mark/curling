<template>
	<vscode-tab-panel>
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
					<SingleSelect v-model="modelValue.protocol" :items="['HTTP', 'HTTPS']" />
				</div>
				<div>
					<p>Host</p>
					<TextField v-model="modelValue.hostname" />
				</div>
				<div>
					<p>Port</p>
					<TextField v-model="modelValue.port" type="number" />
				</div>
			</div>
			<fieldset class="border border-gray-500/20 rounded p-4 mt-4 inline-block">
				<legend class="ml-4 px-4">Authentication</legend>
				<div class="flex flex-col gap-4">
					<div>
						<vscode-checkbox
							label="Enable Auth"
							:checked="modelValue.auth"
							@change="modelValue.auth = $event.target.checked"
						/>
					</div>
					<div>
						<p>Username</p>
						<TextField v-model="modelValue.username" />
					</div>
					<div>
						<p>Password</p>
						<TextField
							v-model="modelValue.password"
							type="password"
							placeholder="Leave blank to keep the same"
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

const modelValue = defineModel({
	type: Object,
	default: () => ({}),
});
</script>
