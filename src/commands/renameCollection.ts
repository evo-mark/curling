import { window, commands } from "vscode";
import { rename } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot } from "../utils/file";
import kebabCase from "lodash.kebabcase";
import startCase from "lodash.startcase";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";
import { slugify } from "../utils";

export async function renameCollection(item) {
	const collection = await item;
	const root = getWorkspaceRoot();
	const baseCollectionsDir = join(root, ".curling", "collections");

	const newCollectionName = await window.showInputBox({
		value: startCase(collection.slug),
		ignoreFocusOut: true,
		placeHolder: "Enter new collection name",
		validateInput: (value) => {
			return /[^a-zA-Z0-9\s-]/.test(value) || /^[0-9-]/.test(value)
				? "Can only contain letters, numbers, spaces and hyphens"
				: null;
		},
	});
	if (!newCollectionName) return;

	const newCollectionSlug = slugify(newCollectionName);
	const index = await readOrCreateCollectionsIndex(baseCollectionsDir);

	const existingIndex = index.items.findIndex((item) => item.slug == collection.slug);
	if (!existingIndex && existingIndex !== 0) {
		window.showErrorMessage("Error", {
			detail: `There was a problem renaming this collection`,
			modal: true,
		});
		return;
	}

	const alreadyExists = index.items.find((item) => item.slug == newCollectionSlug);
	if (alreadyExists) {
		window.showErrorMessage("Already Exists", {
			detail: `A collection named ${newCollectionName} (${newCollectionSlug}) already exists in this workspace`,
			modal: true,
		});
		return;
	}

	index.items[existingIndex] = Object.assign(index.items[existingIndex], {
		label: newCollectionName,
		slug: newCollectionSlug,
	});
	await saveCollectionsIndex(baseCollectionsDir, index);
	await rename(join(baseCollectionsDir, collection.slug), join(baseCollectionsDir, newCollectionSlug));
	commands.executeCommand("evomark-curling.refreshCollections");

	window.showInformationMessage(`The collection was renamed`);
}
