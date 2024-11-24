import { window, commands } from "vscode";
import { rename } from "node:fs/promises";
import { slugify, getRequestPath, checkFileExists, getJsonFile, saveRequest } from "../utils";
import type { RequestTreeItem } from "../views/collections";

export async function renameRequest(item: RequestTreeItem | Promise<RequestTreeItem>) {
	const request = await item;

	const newRequestName = await window.showInputBox({
		value: request.label as string,
		ignoreFocusOut: true,
		placeHolder: "Enter new request name",
		validateInput: (value) => {
			return /[^a-zA-Z0-9\s-]/.test(value) || /^[0-9-]/.test(value)
				? "Can only contain letters, numbers, spaces and hyphens"
				: null;
		},
	});
	if (!newRequestName) return;

	const newRequestSlug = slugify(newRequestName);
	const oldRequestPath = getRequestPath(request.collectionSlug, request.slug, request.method);

	const newRequestPath = getRequestPath(request.collectionSlug, newRequestSlug, request.method);
	const alreadyExists = await checkFileExists(newRequestPath);

	if (alreadyExists) {
		window.showErrorMessage("Already Exists", {
			detail: `A request named ${newRequestName} (${newRequestSlug}) with the method ${request.method} already exists in this collection`,
			modal: true,
		});
		return;
	}

	const json = await getJsonFile(oldRequestPath);
	json.label = newRequestName;
	json.slug = newRequestSlug;

	await rename(oldRequestPath, newRequestPath);
	await saveRequest(newRequestPath, json, true);

	window.showInformationMessage(`Request was renamed to "${newRequestName}".`);
	commands.executeCommand("evomark-curling.refreshCollections");
}
