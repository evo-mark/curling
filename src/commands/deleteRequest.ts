import { window, commands } from "vscode";
import { rm } from "node:fs/promises";
import { getRequestPath } from "../utils";
import type { RequestTreeItem } from "../views/collections";

export async function deleteRequest(item: RequestTreeItem | Promise<RequestTreeItem>) {
	const request = await item;

	const isConfirmed = await window.showWarningMessage(
		"Confirm Delete request",
		{
			detail: `Are you sure you want to delete the ${request.method} request "${request.label}"?\n\nYou will not be able to undo this.`,
			modal: true,
		},
		...["Delete"]
	);

	if (isConfirmed !== "Delete") return;

	const requestPath = getRequestPath(request.collectionSlug, request.slug, request.method);
	await rm(requestPath, {
		force: true,
	});

	commands.executeCommand("evomark-curling.refreshCollections");
	window.showInformationMessage(`"${request.label}" was deleted`);
}
