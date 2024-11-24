<template>
	<vscode-table bordered-columns zebra :columns="['40%', '40%', '10%', '10%']">
		<vscode-table-header slot="header">
			<vscode-table-header-cell>Name</vscode-table-header-cell>
			<vscode-table-header-cell>
				<span v-if="props.files">File</span>
				<span v-else>Value</span>
			</vscode-table-header-cell>
			<vscode-table-header-cell>
				<div class="flex justify-center w-full">Active</div>
			</vscode-table-header-cell>
			<vscode-table-header-cell>&nbsp;</vscode-table-header-cell>
		</vscode-table-header>
		<vscode-table-body slot="body">
			<vscode-table-row v-for="(row, index) in modelValue" :key="index">
				<vscode-table-cell style="padding-left: 0px">
					<div class="w-full">
						<input
							type="text"
							:value="row.name"
							class="w-full bg-transparent appearance-none py-1 px-2.5"
							@input="row.name = $event.target.value"
						/>
					</div>
				</vscode-table-cell>
				<vscode-table-cell style="padding-left: 0px">
					<div v-if="props.files">
						<input
							type="file"
							:value="row.value"
							class="w-full bg-transparent appearance-none py-1 px-2.5"
							@change="onFileSelect"
						/>
					</div>
					<div v-else>
						<input
							type="text"
							:value="row.value"
							class="w-full bg-transparent appearance-none py-1 px-2.5"
							@input="row.value = $event.target.value"
						/>
					</div>
				</vscode-table-cell>
				<vscode-table-cell>
					<div class="flex items-center justify-center">
						<vscode-checkbox
							:checked="row.active === true"
							@change="row.active = $event.target.checked"
						></vscode-checkbox>
					</div>
				</vscode-table-cell>
				<vscode-table-cell style="padding-left: 0px">
					<button
						class="before:rounded-full mx-auto relative size-7 flex justify-center items-center active:before:opacity-20 before:bg-current before:absolute before:inset-0 before:opacity-0 hover:before:opacity-10"
						@click="onDeleteParam(index)"
					>
						<i class="codicon codicon-trash"></i>
					</button>
				</vscode-table-cell>
			</vscode-table-row>
		</vscode-table-body>
	</vscode-table>
	<div class="flex justify-end py-4">
		<vscode-button secondary @click="addParam">
			<i class="codicon codicon-plus"></i>
			<span v-if="props.files">Add File</span>
			<span v-else>Add Param</span>
		</vscode-button>
	</div>
</template>

<script setup>
import {
	VscodeTable,
	VscodeTableHeader,
	VscodeTableHeaderCell,
	VscodeTableBody,
	VscodeTableCell,
	VscodeCheckbox,
	VscodeButton,
} from "@vscode-elements/elements";

const modelValue = defineModel({
	type: Array,
	required: true,
});

const props = defineProps({
	files: {
		type: Boolean,
		default: false,
	},
});

const addParam = () => {
	modelValue.value.push({
		name: "",
		value: "",
		active: true,
	});
};

const onDeleteParam = (index) => {
	modelValue.value = modelValue.value.toSpliced(index, 1);
};

const uploadFile = (file) => {
	console.log(file);
};

const onFileSelect = ($event) => {
	const file = $event.target.files[0];
	if (file) {
		const reader = new FileReader();
		reader.onload = uploadFile.bind(null, file);
		reader.readAsArrayBuffer(file);
	}
};
</script>
