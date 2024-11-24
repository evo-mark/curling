import { window, commands } from "vscode";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot } from "../utils/file";
import kebabCase from "lodash.kebabcase";
import startCase from "lodash.startcase";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";

export async function duplicateCollection(item) {
	const collection = await item;
	const root = getWorkspaceRoot();

	const collectionName = await window.showInputBox({
		value: startCase(collection.slug) + " copy",
		ignoreFocusOut: true,
		placeHolder: "Enter collection name",
		validateInput: (value) => {
			return /[^a-zA-Z0-9\s-]/.test(value) || /^[0-9-]/.test(value)
				? "Can only contain letters, numbers, spaces and hyphens"
				: null;
		},
	});
	if (!collectionName) return;

	const collectionSlug = kebabCase(collectionName).replace(/&/g, "-and-");
	const index = await readOrCreateCollectionsIndex(join(root, ".curling", "collections"));

	const hasExisting = index.items.find((item) => item.slug == collectionSlug);
	console.log(hasExisting, collectionName, collectionSlug);
	if (hasExisting) {
		window.showErrorMessage("Already Exists", {
			detail: `The collection ${collectionName} (${collectionSlug}) already exists in this workspace`,
			modal: true,
		});
		return;
	}

	window.showInformationMessage(`The collection was duplicated`);
}
