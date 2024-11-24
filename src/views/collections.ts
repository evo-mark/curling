import {
	type TreeDataProvider,
	type TreeItemLabel,
	EventEmitter,
	Event,
	TreeItemCollapsibleState,
	TreeItem,
	ProviderResult,
} from "vscode";
import { join } from "node:path";
import { getCollectionDirectory } from "../utils/collections";
import { readFile, readdir } from "node:fs/promises";
import startCase from "lodash.startcase";

function stripExtension(str: string): string {
	return str.substring(0, str.lastIndexOf("."));
}

/**
 * @implements {TreeDataProvider}
 */
class CurlingCollectionsProvider implements TreeDataProvider<CollectionItem> {
	private workspaceRoot: string;

	private _onDidChangeTreeData: EventEmitter<CollectionItem | undefined | void> = new EventEmitter<
		CollectionItem | undefined | void
	>();

	readonly onDidChangeTreeData: Event<CollectionItem | undefined | void> = this._onDidChangeTreeData.event;

	constructor(workspaceRoot: string) {
		this.workspaceRoot = workspaceRoot;
	}

	refresh() {
		this._onDidChangeTreeData.fire(); // Notify listeners of changes
	}

	/**
	 * Get {@link TreeItem} representation of the `element`
	 *
	 * @param element The element for which {@link TreeItem} representation is asked for.
	 * @returns TreeItem representation of the element.
	 */
	getTreeItem(element) {
		return element;
	}

	/**
	 * Get the children of `element` or root if no element is passed.
	 *
	 * @param element The element from which the provider gets children. Can be `undefined`.
	 * @returns Children of `element` or root if no element is passed.
	 */
	async getChildren(element?: CollectionItem): Promise<CollectionItem[]> {
		if (!element) {
			const index = await this.#getJson();
			if (!index?.items?.length) return [];
			else return this.#createCollectionItems(index.items);
		} else {
			const item = await element;
			const collectionDirectory = getCollectionDirectory(item.slug);
			const collectionRequests = await readdir(collectionDirectory);
			return Promise.all(
				collectionRequests.map(async (request) => {
					const json = await readFile(join(collectionDirectory, request), "utf-8");
					return new RequestItem(JSON.parse(json), item.slug);
				})
			);
		}
	}

	async #getJson() {
		const filePath = join(this.workspaceRoot, ".curling", "collections", "index.json");

		try {
			const content = await readFile(filePath, "utf-8");
			const json = JSON.parse(content);
			return json;
		} catch (err) {
			return null;
		}
	}

	async #createCollectionItems(items) {
		return items.map(async (item) => {
			const requests = await readdir(join(this.workspaceRoot, ".curling", "collections", item.slug));
			const collectionDirectory = getCollectionDirectory(item.slug);
			const collectionRequests = await readdir(collectionDirectory);
			return new CollectionItem(
				item.label,
				requests.length > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
				`${requests.length} request${requests.length !== 1 ? "s" : ""}`,
				item.slug
			);
		});
	}
}

class RequestItem extends TreeItem {
	public slug: string;
	public method: string;
	public collectionSlug: string;
	public contextValue = "request";

	constructor(json: Record<string, any>, collectionSlug: string) {
		const label = json.label;
		super(label, TreeItemCollapsibleState.None);

		this.slug = json.slug;
		this.method = json.method;
		this.description = json.method;
		this.collectionSlug = collectionSlug;
	}
}

export type RequestTreeItem = InstanceType<typeof RequestItem>;

class CollectionItem extends TreeItem {
	public slug: string;
	public contextValue = "collection";

	constructor(
		label: string | TreeItemLabel,
		collapsibleState: TreeItemCollapsibleState,
		description: string,
		slug: string = ""
	) {
		super(label, collapsibleState);
		this.tooltip = `View the ${this.label} collection`;
		this.description = description;
		this.slug = slug;
	}
}

export default CurlingCollectionsProvider;
