import { window, commands, ExtensionContext } from "vscode";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot, slugify } from "../utils";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";

export async function setProxyPassword(this: ExtensionContext) {
	const hasExisting = await this.secrets.get("curling.proxy.password");

	const savePassword = async () => {
		const password = await window.showInputBox({
			prompt: "Enter your password",
			password: true,
			ignoreFocusOut: true,
		});

		if (password) {
			await this.secrets.store("curling.proxy.password", password);
			window.showInformationMessage("Password saved!");
		}
	};

	if (hasExisting) {
		window
			.showInformationMessage(
				"A password is already saved. Would you like to update it?",
				{
					modal: true,
				},
				"Yes"
			)
			.then(async (selection) => {
				if (selection === "Yes") {
					savePassword();
				}
			});
	} else {
		savePassword();
	}
}
