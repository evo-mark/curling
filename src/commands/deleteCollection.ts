import { window, commands } from "vscode";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot } from "../utils/file";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";

export async function deleteCollection(item) {
	const collection = await item;
	const root = getWorkspaceRoot();

	const isConfirmed = await window.showWarningMessage(
		"Confirm Delete Collection",
		{
			detail: `Are you sure you want to delete the "${collection.label}" collection? All requests, sub-collections and settings will be lost!`,
			modal: true,
		},
		...["Delete"]
	);

	if (isConfirmed !== "Delete") return;

	const dirPath = join(root, ".curling", "collections");
	const index = await readOrCreateCollectionsIndex(dirPath);

	index.items = index.items.filter((item) => {
		return item.slug !== collection.slug;
	});

	await saveCollectionsIndex(dirPath, index);
	await rm(join(dirPath, collection.slug), {
		recursive: true,
		force: true,
	});

	window.showInformationMessage("Collection Deleted");
	commands.executeCommand("evomark-curling.refreshCollections");
}
