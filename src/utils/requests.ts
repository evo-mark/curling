import { writeFile, mkdir } from "node:fs/promises";
import { checkFileExists, getJsonFile, getRequestPath, getWorkspaceRoot } from "./file";
import { AxiosResponse } from "axios";
import { join } from "node:path";
import { createHash } from "node:crypto";
import type { CurlingHeader, CurlingVariable, CurlingScripts } from "./types";

interface CurlingRequest {
	id: string;
	label: string;
	slug: string;
	url: string;
	method: "GET" | "POST" | "PATCH" | "PUT" | "OPTIONS" | "DELETE";
	headers: CurlingHeader[];
	query: CurlingVariable[];
	scripts: CurlingScripts;
}

export async function findRequest(slug: string, method: string, collectionSlug: string) {
	const path = getRequestPath(collectionSlug, slug, method);
	return await getJsonFile<CurlingRequest>(path);
}

/**
 * Given an absolute path and JSON object, saves the request object to file
 */
export async function saveRequest(path: string, content: Record<string, unknown>, errorOnNotExists: boolean = false) {
	if (!content) {
		throw new Error("Request content is empty");
	}

	const exists = await checkFileExists(path);

	if (!exists && errorOnNotExists === true) {
		throw new Error("Request file does not exists at " + path);
	}

	content.lastUpdated = Date.now();
	await writeFile(path, JSON.stringify(content, undefined, 2));
	return true;
}

function getResponseDirectory() {
	const root = getWorkspaceRoot();
	return join(root, ".curling", "responses");
}

function getResponseFilename(...params: string[]): string {
	const hash = createHash("md5").update(params.join("_")).digest("hex");
	return hash + "-" + Date.now() + ".json";
}

export async function saveResponse(
	collectionSlug: string,
	requestSlug: string,
	requestMethod: string,
	response: AxiosResponse
) {
	const dir = getResponseDirectory();
	await mkdir(dir, {
		recursive: true,
	});
	const filename = getResponseFilename(collectionSlug, requestSlug, requestMethod);
	const time = new Date().toISOString().substring(0, 16);

	const payload = {
		time,
		data: response.data,
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	};

	await writeFile(join(dir, filename), JSON.stringify(payload));
	const ignoreExists = await checkFileExists(join(dir, ".gitignore"));

	if (!ignoreExists) {
		const content = `*
!.gitignore`;
		await writeFile(join(dir, ".gitignore"), content);
	}

	return [filename, payload];
}

export const requestMethods = [
	{
		label: "GET",
		description: "Retrieve data only",
	},
	{
		label: "POST",
		description: "Submits an entity to the specified resource",
	},
	{
		label: "PATCH",
		description: "Applies partial modifications to a resource.",
	},
	{
		label: "PUT",
		description: "Replaces the target resource with the request content.",
	},
	{
		label: "DELETE",
		description: "Deletes the specified resource.",
	},
	{
		label: "OPTIONS",
		description: "Describes the communication options for the target resource.",
	},
];
