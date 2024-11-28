import { ExtensionContext, ViewColumn, WebviewPanel, window, ColorThemeKind, commands, SecretStorage } from "vscode";
import { BasePanelClass } from "../utils";
import {
	findCollection,
	readOrCreateCollectionsIndex,
	saveCollectionsIndex,
	getCollectionsDirectory,
} from "../../utils";
import { v4 as uuidV4 } from "uuid";

class CollectionPanel extends BasePanelClass {
	public panelName: string = "collection";

	constructor(panel: WebviewPanel, context: ExtensionContext) {
		super(panel, context, "src/webviews/collection/index.html", "collection");
	}

	public getApi() {
		const self = this;
		return {
			async update(data: any) {
				const { collection } = data;
				if (!collection.id) {
					collection.id = uuidV4();
				}

				if (collection.proxy.password) {
					const key = `curling.collections.${collection.id}.proxy-password`;
					await self._context.secrets.store(key, collection.proxy.password);
				}

				delete collection.proxy.password;

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
					retainContextWhenHidden: true,
				}
			);

			const collectionPanel = new CollectionPanel(panel, context);

			BasePanelClass.currentPanels.set(collectionPanel.panelName, collectionPanel);
		}

		const collection = await findCollection(collectionItem.slug);
		collection.proxy.password = "";
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
