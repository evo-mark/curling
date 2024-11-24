import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot } from "./file";

function getCollectionsDirectory(): string {
	const root = getWorkspaceRoot();
	return join(root, ".curling", "collections");
}

function getCollectionDirectory(collection: string): string {
	const root = getCollectionsDirectory();
	return join(root, collection);
}

async function readOrCreateCollectionsIndex(baseDir?: string) {
	if (!baseDir) {
		baseDir = getCollectionsDirectory();
	}

	const filePath = join(baseDir, "index.json");

	let content = {
		version: 1,
		items: [],
		lastUpdated: Date.now(),
	};

	try {
		const raw = await readFile(filePath, "utf8");
		content = JSON.parse(raw);
	} catch (err) {
		// Only throw error if it's not a "File not Found" one
		if (err.code !== "ENOENT") throw err;
	}

	return content;
}

async function saveCollectionsIndex(baseDir, content) {
	if (!content) {
		throw new Error("Collection index content is empty");
	}
	const filePath = join(baseDir, "index.json");

	content.lastUpdated = Date.now();
	await writeFile(filePath, JSON.stringify(content, undefined, 2));
	return true;
}

export { readOrCreateCollectionsIndex, saveCollectionsIndex, getCollectionDirectory };
