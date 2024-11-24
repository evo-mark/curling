<template>
	<div ref="comboboxRef" class="combobox w-full">
		<!-- Trigger for dropdown -->
		<input
			@focus="toggleDropdown"
			class="combobox-input w-full"
			:value="modelValue"
			:placeholder="placeholder"
			@input="modelValue = $event.target.value"
		/>

		<!-- Dropdown teleported to body -->
		<teleport to="body">
			<div
				v-if="isDropdownOpen"
				ref="dropdownRef"
				class="combobox-dropdown shadow-xl"
				v-bind="containerProps"
				:style="dropdownStyles"
			>
				<ul v-bind="wrapperProps">
					<li
						v-for="item in list"
						:key="item.index"
						@click="selectItem(item.data)"
						class="combobox-item flex items-center"
					>
						{{ item.data }}
					</li>
				</ul>
			</div>
		</teleport>
	</div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useElementBounding, useVirtualList, onClickOutside } from "@vueuse/core";

const modelValue = defineModel({
	type: [String, Number],
	default: "",
});

const props = defineProps({
	items: {
		type: Array,
		required: true,
	},
	placeholder: {
		type: String,
		default: "Select an item",
	},
	multiple: {
		type: Boolean,
		default: false,
	},
});

const comboboxRef = ref(null);
const dropdownRef = ref(null);
const isDropdownOpen = ref(false);

// VueUse: Get bounding box for the combobox
const { top, left, width, height } = useElementBounding(comboboxRef);

// Computed style for dropdown
const dropdownStyles = computed(() => ({
	position: "absolute",
	top: `${top.value + height.value}px`,
	left: `${left.value}px`,
	width: `${width.value}px`,
	zIndex: 1000,
	maxHeight: "300px",
}));

const toggleDropdown = () => {
	isDropdownOpen.value = !isDropdownOpen.value;
};

const selectItem = (item) => {
	modelValue.value = item;
	isDropdownOpen.value = false;
};

// Close the dropdown when clicking outside
onClickOutside(
	comboboxRef,
	() => {
		isDropdownOpen.value = false;
	},
	{
		detectIframe: true,
	}
);

const filteredItems = computed(() =>
	props.items.filter((item) => {
		const lowerCaseItem = item.toLowerCase();
		const lowerCaseMatch = modelValue.value.toLowerCase();
		return lowerCaseItem.includes(lowerCaseMatch);
	})
);

const { list, containerProps, wrapperProps } = useVirtualList(filteredItems, {
	itemHeight: 35,
});

watch(isDropdownOpen, (open) => {
	if (open) {
		// Recalculate bounding box when dropdown opens
		setTimeout(() => comboboxRef.value?.getBoundingClientRect(), 0);
	}
});
</script>

<style>
.combobox {
	display: inline-block;
	position: relative;
}

.combobox-input {
	padding: 8px 12px;
	background-color: transparent;
	cursor: pointer;
	appearance: none;
}

.combobox-dropdown {
	border: 2px solid var(--button-border);
	background-color: var(--dropdown-background);
	color: var(--dropdown-foreground);
	overflow: hidden;
}

.combobox-item {
	padding: 4px 12px;
	cursor: pointer;
	height: 35px;
}

.combobox-item:hover {
	background-color: var(--list-active-selection-background);
}
</style>
