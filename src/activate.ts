import { commands, window, ExtensionContext } from "vscode";
import CurlingCollectionsProvider from "./views/collections";
import { getWorkspaceRoot } from "./utils/file";
import {
	createCollection,
	deleteCollection,
	duplicateCollection,
	createRequest,
	renameCollection,
	renameRequest,
	duplicateRequest,
	executeRequest,
	deleteRequest,
	setProxyPassword,
} from "./commands";
import RequestPanel from "./webviews/request/RequestPanel";
import CollectionPanel from "./webviews/collection/CollectionPanel";

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context: ExtensionContext) {
	const collectionsTreeProvider = new CurlingCollectionsProvider(getWorkspaceRoot());
	const collectionsView = window.createTreeView("curlingCollections", {
		treeDataProvider: collectionsTreeProvider,
	});
	collectionsView.onDidChangeSelection(async (ev) => {
		const selectedItem = await ev.selection[0];
		if (selectedItem && selectedItem.contextValue === "request") {
			RequestPanel.render(context, selectedItem);
		} else if (selectedItem && selectedItem.contextValue === "collection") {
			CollectionPanel.render(context, selectedItem);
		}
	});

	commands.registerCommand("evomark-curling.openSettings", () => {
		commands.executeCommand("workbench.action.openSettings", "@ext:evomark.evomark-curling");
	});

	const setProxyPasswordDisposable = commands.registerCommand(
		"evomark-curling.setProxyPassword",
		setProxyPassword.bind(context)
	);

	const refreshDisposable = commands.registerCommand("evomark-curling.refreshCollections", () => {
		collectionsTreeProvider.refresh();
	});

	// Collection commands
	const createDisposable = commands.registerCommand("evomark-curling.createCollection", createCollection);
	const renameDisposable = commands.registerCommand("evomark-curling.renameCollection", renameCollection);
	const duplicateDisposable = commands.registerCommand("evomark-curling.duplicateCollection", duplicateCollection);
	const deleteDisposable = commands.registerCommand("evomark-curling.deleteCollection", deleteCollection);

	// Request commands
	const createReqDisposable = commands.registerCommand("evomark-curling.createRequest", createRequest);
	const renameReqDisposable = commands.registerCommand("evomark-curling.renameRequest", renameRequest);
	const duplicateReqDisposable = commands.registerCommand("evomark-curling.duplicateRequest", duplicateRequest);
	const executeReqDisposable = commands.registerCommand("evomark-curling.executeRequest", executeRequest);
	const deleteReqDisposable = commands.registerCommand("evomark-curling.deleteRequest", deleteRequest);

	context.subscriptions.push(
		createDisposable,
		deleteDisposable,
		refreshDisposable,
		duplicateDisposable,
		renameDisposable,
		createReqDisposable,
		renameReqDisposable,
		duplicateReqDisposable,
		executeReqDisposable,
		deleteReqDisposable,
		setProxyPasswordDisposable
	);
}

export default activate;
