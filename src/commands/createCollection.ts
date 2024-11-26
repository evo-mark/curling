import { window, commands } from "vscode";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot, slugify } from "../utils";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";

export async function createCollection() {
	const root = getWorkspaceRoot();
	const collectionName = await window.showInputBox({
		ignoreFocusOut: true,
		placeHolder: "Enter collection name",
		validateInput: (value) => {
			return /[^a-zA-Z0-9\s-]/.test(value) || /^[0-9-]/.test(value)
				? "Can only contain letters, numbers, spaces and hyphens"
				: null;
		},
	});
	const collectionSlug = slugify(collectionName);

	if (!collectionName || !collectionSlug) {
		return;
	}

	const dirPath = join(root, ".curling", "collections");
	await mkdir(dirPath, { recursive: true });
	const index = await readOrCreateCollectionsIndex(dirPath);

	const hasExisting = index.items.find((item) => item.slug == collectionSlug);

	if (hasExisting) {
		window.showErrorMessage("Already Exists", {
			detail: `The collection ${collectionName} (${collectionSlug}) already exists in this workspace`,
			modal: true,
		});
		return;
	}

	index.items.push({
		label: collectionName,
		slug: collectionSlug,
		headers: [],
		auth: {},
		scripts: {
			pre: "",
			preError: "",
			post: "",
			postError: "",
		},
		proxy: {},
		secrets: [],
	});

	await saveCollectionsIndex(dirPath, index);
	await mkdir(join(dirPath, collectionSlug), { recursive: true });

	commands.executeCommand("evomark-curling.refreshCollections");
	window.showInformationMessage(`The collection "${collectionName}" was created`);
}
