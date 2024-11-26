import { ExtensionContext, ViewColumn, WebviewPanel, window, ColorThemeKind, commands } from "vscode";
import { BasePanelClass } from "../utils";
import {
	findCollection,
	readOrCreateCollectionsIndex,
	saveCollectionsIndex,
	getCollectionsDirectory,
} from "../../utils";

class CollectionPanel extends BasePanelClass {
	public panelName: string = "collection";

	constructor(panel: WebviewPanel, context: ExtensionContext) {
		super(panel, context, "src/webviews/collection/index.html", "collection");
	}

	public getApi() {
		return {
			async update(data: any) {
				const { collection } = data;
				const index = await readOrCreateCollectionsIndex();
				const itemIndex = index.items.findIndex((item) => item.slug == collection.slug);
				index.items[itemIndex] = collection;
				const baseCollectionsDir = getCollectionsDirectory();
				await saveCollectionsIndex(baseCollectionsDir, index);
				window.showInformationMessage("Saved");
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

		const collection = await findCollection(collectionItem.slug);
		BasePanelClass.currentPanels.get("collection")._panel.webview.postMessage({
			type: "hydrate",
			data: {
				isDark: window.activeColorTheme.kind === ColorThemeKind.Dark,
				collection,
			},
		});
	}
}

export default CollectionPanel;
