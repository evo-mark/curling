import { window, commands } from "vscode";
import { constants as fsConstants, access, writeFile } from "node:fs/promises";
import { getWorkspaceRoot, slugify, getRequestPath } from "../utils";
import { v4 as uuidV4 } from "uuid";

export async function createRequest(item) {
	const root = getWorkspaceRoot();
	const collection = await item;

	const requestName = await window.showInputBox({
		title: "Request Name",
		ignoreFocusOut: true,
		placeHolder: "Enter request name",
		validateInput: (value) => {
			return /[^a-zA-Z0-9\s-]/.test(value) || /^[0-9-]/.test(value)
				? "Can only contain letters, numbers, spaces and hyphens"
				: null;
		},
	});
	const requestSlug = slugify(requestName);

	const requestMethods = [
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

	const selectedMethod = await window.showQuickPick(requestMethods, {
		placeHolder: "Choose a request method",
		canPickMany: false,
		ignoreFocusOut: true,
		title: "Request Method",
	});
	if (!selectedMethod) return;

	const json = {
		id: uuidV4(),
		label: requestName,
		slug: requestSlug,
		method: selectedMethod.label,
		query: [],
		headers: [],
		url: null,
		body: {
			type: "JSON",
			multipart: {
				params: [],
				files: [],
			},
			urlEncoded: [],
			json: "",
			xml: "",
			text: "",
		},
		auth: {
			type: "none",
		},
		scripts: {
			pre: "",
			preError: "",
			post: "",
			postError: "",
		},
	};

	const requestPath = getRequestPath(collection.slug, requestSlug, selectedMethod.label);
	try {
		await access(requestPath, fsConstants.F_OK);
		window.showErrorMessage("Request file already exists");
		return;
	} catch (err) {
		// All ok
	}

	await writeFile(requestPath, JSON.stringify(json, undefined, 2));

	commands.executeCommand("evomark-curling.refreshCollections");
	window.showInformationMessage(`The request was created`);
}
