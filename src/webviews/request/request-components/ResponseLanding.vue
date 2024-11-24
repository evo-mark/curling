<template>
	<div class="text-7xl -rotate-45 mt-20 mb-8"><i class="codicon codicon-send" style="font-size: 1em"></i></div>
	<div class="grid grid-cols-2 items-center gap-8">
		<div>Send Request</div>
		<div v-if="os === 'darwin'">
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-5 inline">
					<title>apple-keyboard-command</title>
					<path
						class="fill-current"
						d="M6,2A4,4 0 0,1 10,6V8H14V6A4,4 0 0,1 18,2A4,4 0 0,1 22,6A4,4 0 0,1 18,10H16V14H18A4,4 0 0,1 22,18A4,4 0 0,1 18,22A4,4 0 0,1 14,18V16H10V18A4,4 0 0,1 6,22A4,4 0 0,1 2,18A4,4 0 0,1 6,14H8V10H6A4,4 0 0,1 2,6A4,4 0 0,1 6,2M16,18A2,2 0 0,0 18,20A2,2 0 0,0 20,18A2,2 0 0,0 18,16H16V18M14,10H10V14H14V10M6,16A2,2 0 0,0 4,18A2,2 0 0,0 6,20A2,2 0 0,0 8,18V16H6M8,6A2,2 0 0,0 6,4A2,2 0 0,0 4,6A2,2 0 0,0 6,8H8V6M18,8A2,2 0 0,0 20,6A2,2 0 0,0 18,4A2,2 0 0,0 16,6V8H18Z"
					/>
				</svg>
				+ Enter
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, watch } from "vue";
import { useMagicKeys } from "@vueuse/core";

const emit = defineEmits(["send"]);
const { os } = defineProps({
	os: {
		type: String,
		default: null,
	},
});

const keys = useMagicKeys();
const sendRequest = computed(() => (os === "darwin" ? keys["Meta+Enter"].value : keys["Ctrl+Enter"].value));
watch(sendRequest, (v) => {
	if (v) emit("send");
});
</script>
