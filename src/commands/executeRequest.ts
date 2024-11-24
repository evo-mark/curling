import { window, commands } from "vscode";
import { mkdir, constants as fsConstants, access, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot, slugify, getCollectionRoot, getRequestPath } from "../utils";
import kebabCase from "lodash.kebabcase";
import { readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";

export async function executeRequest(item) {
	window.showInformationMessage(`Not implemented`);
}
