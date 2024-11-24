import { ExtensionContext, ViewColumn, WebviewPanel, window, ColorThemeKind, commands, workspace } from "vscode";
import { BasePanelClass } from "../utils";
import { readFile, rename } from "node:fs/promises";
import { checkFileExists, getRequestPath, saveRequest } from "../../utils";
import { getAllSettings } from "../utils/workspace";
import { getFileUploadsDirectory } from "../../utils/uploads";

class RequestPanel extends BasePanelClass {
	public panelName: string = "request";

	constructor(panel: WebviewPanel, context: ExtensionContext) {
		super(panel, context, "src/webviews/request/index.html", "request");
	}

	public getApi() {
		return {
			async update(data: any) {
				let requestPath = data.path;

				const maybeNewPath = getRequestPath(data.collection, data.request.slug, data.request.method);
				// If the request method has changed, we need to rename the file
				if (requestPath !== maybeNewPath) {
					const alreadyExists = await checkFileExists(maybeNewPath);
					if (alreadyExists) {
						window.showErrorMessage("Already Exists", {
							detail: `A request named ${data.request.label} (${data.request.slug}) with the method ${data.request.method} already exists in this collection`,
							modal: true,
						});
						return;
					}
					await rename(requestPath, maybeNewPath);
					requestPath = maybeNewPath;
				}

				await saveRequest(requestPath, data.request, true);
				window.showInformationMessage("Saved");

				commands.executeCommand("evomark-curling.refreshCollections");
				BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
					type: "update",
					data: {
						path: requestPath,
					},
				});
				return;
			},
			async send(data: any) {
				BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
					type: "send",
					data: {
						foo: "bar",
					},
				});
				// return new filename
				return;
			},
			async uploadFile(data: any) {
				const { fileName, fileContent } = data;
				const buffer = Buffer.from(fileContent);

				const directory = getFileUploadsDirectory();

				BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
					type: "uploadFile",
					data: {
						foo: "bar",
					},
				});
				return;
			},
		};
	}

	public static async render(context: ExtensionContext, requestItem: any) {
		const requestPath = getRequestPath(requestItem.collectionSlug, requestItem.slug, requestItem.method);
		const requestRaw = await readFile(requestPath, "utf-8");
		const request = JSON.parse(requestRaw);

		if (BasePanelClass.currentPanels.get("request")) {
			BasePanelClass.currentPanels.get("request")._panel.reveal(ViewColumn.One);
		} else {
			const panel = window.createWebviewPanel(
				"showRequestPage",
				"Request: " + requestItem.label,
				ViewColumn.One,
				{
					enableScripts: true,
				}
			);

			const requestPanel = new RequestPanel(panel, context);

			BasePanelClass.currentPanels.set("request", requestPanel);
		}

		BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
			type: "hydrate",
			data: {
				isDark: window.activeColorTheme.kind === ColorThemeKind.Dark,
				os: process.platform,
				path: requestPath,
				collection: requestItem.collectionSlug,
				request,
				config: getAllSettings(),
			},
		});
	}
}

export default RequestPanel;
