import { workspace } from "vscode";
import { join, dirname, extname, basename } from "node:path";
import { access, constants as fsConstants, readFile } from "node:fs/promises";
import lowerCase from "lodash.lowercase";

/**
 * @returns { string } The workspace's root URI
 */
function getWorkspaceRoot(): string {
	return workspace.workspaceFolders && workspace.workspaceFolders.length > 0
		? workspace.workspaceFolders[0].uri.fsPath
		: undefined;
}

/**
 * @returns { string } The collection's root URI
 */
function getCollectionRoot(collection: string): string {
	const root = getWorkspaceRoot();
	return join(root, ".curling", "collections", collection);
}

async function getJsonFile<T>(path: string): Promise<T> {
	try {
		const raw = await readFile(path, "utf8");
		return JSON.parse(raw);
	} catch (err) {
		throw err;
	}
}

/**
 * @returns { string } The collection's root URI
 */
function getRequestPath(collection: string, request: string, method: string = "get"): string {
	method = lowerCase(method);
	const collectionPath = getCollectionRoot(collection);
	return join(collectionPath, `${request}_${method}.json`);
}

/**
 * Check if a file exists at the given path
 */
async function checkFileExists(path: string): Promise<boolean> {
	try {
		await access(path, fsConstants.F_OK);
		return true;
	} catch (err) {
		return false;
	}
}

async function getUniqueFilePath(filePath: string): Promise<string> {
	let counter = 1;
	let dir = dirname(filePath);
	let ext = extname(filePath);
	let base = basename(filePath, ext);

	while (await checkFileExists(filePath)) {
		filePath = join(dir, `${base}-${counter}${ext}`);
		counter++;
	}

	return filePath;
}

export { getUniqueFilePath, getWorkspaceRoot, getCollectionRoot, getRequestPath, checkFileExists, getJsonFile };
