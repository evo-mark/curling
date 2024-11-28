import { reactive, toRefs, watch, onMounted } from "vue";
import { vscode } from "../utils";
import { useTheme } from "./useTheme";
import debounce from "lodash.debounce";

const restoreState = (key = null) => {
	const existingRaw = vscode.getState();
	if (!existingRaw) return {};

	const existing = typeof existingRaw === "string" ? JSON.parse(existingRaw) : existingRaw;
	return key ? existing[key] : existing;
};

const updateState = (state, newState) => {
	for (const key in state) {
		state[key] = newState[key] ?? null;
	}
};

export const useState = (key: string, schema: Record<string, unknown>) => {
	schema.os = null;
	schema.isDark = false;
	schema.isHydrated = false;
	schema.config = {};
	const state = reactive(schema);
	useTheme(() => state.isDark);
	onMounted(() => {
		const restored = restoreState(key);
		updateState(state, restored);
	});

	watch(
		state,
		debounce((v: Record<string, unknown>) => {
			const restored = restoreState();
			restored[key] = v;
			vscode.setState(JSON.stringify(restored));
		}, 1000)
	);

	vscode.on("hydrate", (data) => {
		for (const key in state) {
			state[key] = data[key];
			state.isHydrated = true;
		}
	});

	return toRefs(state);
};
