import { ExtensionContext, ViewColumn, WebviewPanel, window, ColorThemeKind, commands } from "vscode";
import { BasePanelClass } from "../utils";
import { readFile, rename } from "node:fs/promises";
import { checkFileExists, getRequestPath, saveRequest } from "../../utils";

class CollectionPanel extends BasePanelClass {
	public panelName: string = "collection";

	constructor(panel: WebviewPanel, context: ExtensionContext) {
		super(panel, context, "src/webviews/collection/index.html", "collection");
	}

	public getApi() {
		return {
			async update(data: any) {
				// return new filename
				return;
			},
		};
	}

	public static async render(context: ExtensionContext, collectionItem: any) {
		if (BasePanelClass.currentPanels.get("collection")) {
			BasePanelClass.currentPanels.get("collection")._panel.reveal(ViewColumn.One);
		} else {
			const panel = window.createWebviewPanel(
				"showCollectionPage",
				"Collection: " + collectionItem.label,
				ViewColumn.One,
				{
					enableScripts: true,
				}
			);

			const collectionPanel = new CollectionPanel(panel, context);

			BasePanelClass.currentPanels.set(collectionPanel.panelName, collectionPanel);
		}

		BasePanelClass.currentPanels.get("collection")._panel.webview.postMessage({
			type: "hydrate",
			data: {
				isDark: window.activeColorTheme.kind === ColorThemeKind.Dark,
				collection: collectionItem.slug,
			},
		});
	}
}

export default CollectionPanel;
