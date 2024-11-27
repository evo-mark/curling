import { writeFile } from "node:fs/promises";
import { checkFileExists, getJsonFile, getRequestPath } from "./file";

interface CurlingRequest {
	url: string;
	method: "GET" | "POST" | "PATCH" | "PUT" | "OPTIONS" | "DELETE";
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
