import { workspace } from "vscode";

export const getAllSettings = () => {
	const config = workspace.getConfiguration("curling");
	const allSettings = Object.fromEntries(Object.entries(config).filter(([key]) => typeof config[key] !== "function"));
	return allSettings;
};
