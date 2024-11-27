import { window, commands, ExtensionContext } from "vscode";
import { mkdir, constants as fsConstants, access, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { getWorkspaceRoot, slugify, getCollectionRoot, getRequestPath, findRequest } from "../utils";
import kebabCase from "lodash.kebabcase";
import { findCollection, readOrCreateCollectionsIndex, saveCollectionsIndex } from "../utils/collections";
import { getAxiosInstance } from "../utils/axios";

function parseFunction(code: string) {
	const match = code.match(/^function\s*\(([^)]*)\)\s*{([\s\S]*)}$/);

	if (match) {
		const params = match[1].trim(); // Extract "config"
		const body = match[2].trim(); // Extract "config.foo = 'bar';"
		return new Function(params, body);
	}
}

export async function executeRequest(
	requestSlug: string,
	requestMethod: string,
	collectionSlug: string,
	context: ExtensionContext
) {
	const collection = await findCollection(collectionSlug);
	const request = await findRequest(requestSlug, requestMethod, collectionSlug);

	const axios = await getAxiosInstance(context);
	const preFunction = collection.scripts?.pre ? parseFunction(collection.scripts.pre) : undefined;
	const preErrorFunction = collection.scripts?.preError ? parseFunction(collection.scripts.preError) : undefined;
	/** @ts-expect-error */
	axios.interceptors.request.use(preFunction, preErrorFunction);

	const response = await axios({
		method: request.method,
		url: request.url,
	});

	return response;
	window.showInformationMessage(`Not implemented`);
}
