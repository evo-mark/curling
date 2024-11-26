<template>
	<vscode-tab-panel>
		<vscode-table bordered-columns zebra :columns="['40%', '40%', '10%', '10%']">
			<vscode-table-header slot="header">
				<vscode-table-header-cell>Name</vscode-table-header-cell>
				<vscode-table-header-cell>Value</vscode-table-header-cell>
				<vscode-table-header-cell
					><div class="flex justify-center w-full">Active</div></vscode-table-header-cell
				>
				<vscode-table-header-cell>&nbsp;</vscode-table-header-cell>
			</vscode-table-header>
			<vscode-table-body slot="body">
				<vscode-table-row v-if="modelValue?.length === 0" class="flex justify-center py-4 italic">
					None Set
				</vscode-table-row>
				<vscode-table-row v-for="(row, index) in modelValue" :key="index">
					<vscode-table-cell style="padding-left: 0px">
						<div class="w-full">
							<Combobox v-model="row.name" :items="headerOptions" />
						</div>
					</vscode-table-cell>
					<vscode-table-cell style="padding-left: 0px">
						<div>
							<input
								type="text"
								:value="row.value"
								class="w-full bg-transparent appearance-none py-1 px-2.5"
								@input="row.value = $event.target.value"
							/>
						</div>
					</vscode-table-cell>
					<vscode-table-cell>
						<div class="flex justify-center">
							<vscode-checkbox
								:checked="row.active === true"
								@change="row.active = $event.target.checked"
							></vscode-checkbox>
						</div>
					</vscode-table-cell>
					<vscode-table-cell style="padding-left: 0px">
						<button
							class="mx-auto before:rounded-full relative size-7 flex justify-center items-center active:before:opacity-20 before:bg-current before:absolute before:inset-0 before:opacity-0 hover:before:opacity-10"
							@click="onDeleteHeader(index)"
						>
							<i class="codicon codicon-trash"></i>
						</button>
					</vscode-table-cell>
				</vscode-table-row>
			</vscode-table-body>
		</vscode-table>
		<div class="flex justify-end py-4">
			<vscode-button secondary @click="addHeader">
				<i class="codicon codicon-plus"></i>
				<span>Add Header</span>
			</vscode-button>
		</div>
	</vscode-tab-panel>
</template>

<script setup>
import Combobox from "../../components/input/Combobox.vue";
import SingleSelect from "../../components/input/SingleSelect.vue";
import {
	VscodeTabPanel,
	VscodeTable,
	VscodeTableHeader,
	VscodeTableHeaderCell,
	VscodeTableBody,
	VscodeTableCell,
	VscodeButton,
	VscodeCheckbox,
} from "@vscode-elements/elements";

const modelValue = defineModel({
	type: Array,
	required: true,
});

const addHeader = () => {
	modelValue.value.push({
		name: "",
		value: "",
		active: true,
	});
};

const onDeleteHeader = (index) => {
	modelValue.value = modelValue.value.toSpliced(index, 1);
};

const headerOptions = [
	"Accept",
	"Accept-Charset",
	"Accept-Encoding",
	"Accept-Language",
	"Accept-Datetime",
	"Access-Control-Request-Method",
	"Access-Control-Request-Headers",
	"Cache-Control",
	"Connection",
	"Content-Length",
	"Content-Type",
	"Dnt",
	"Expect",
	"Forwarded",
	"From",
	"Host",
	"If-Match",
	"If-Modified-Since",
	"If-None-Match",
	"If-Range",
	"If-Unmodified-Since",
	"Max-Forwards",
	"Origin",
	"Pragma",
	"Proxy-Authorization",
	"Range",
	"Referer",
	"TE",
	"User-Agent",
	"Upgrade",
	"Via",
	"Warning",
	"X-CSRF-Token",
	"X-Requested-With",
];
</script>
