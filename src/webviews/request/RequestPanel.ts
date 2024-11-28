import { requestMethods, saveResponse } from "./../../utils/requests";
import { ExtensionContext, ViewColumn, WebviewPanel, window, ColorThemeKind, commands, workspace } from "vscode";
import { BasePanelClass } from "../utils";
import { readFile, rename, rm, writeFile } from "node:fs/promises";
import { checkFileExists, getRequestPath, getUniqueFilePath, saveRequest } from "../../utils";
import { getAllSettings } from "../utils/workspace";
import { getFileUploadsDirectory } from "../../utils/uploads";
import { basename, extname, join } from "node:path";
import { getAxiosInstance } from "../../utils/axios";
import { v4 as uuidV4 } from "uuid";
import { AxiosResponse } from "axios";

class RequestPanel extends BasePanelClass {
	public panelName: string = "request";

	constructor(panel: WebviewPanel, context: ExtensionContext) {
		super(panel, context, "src/webviews/request/index.html", "request");
	}

	public getApi() {
		return {
			async update(data: any) {
				let requestPath = data.path;
				if (!data.request.id) {
					data.request.id = uuidV4();
				}

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
				const { requestSlug, collectionSlug, requestMethod } = data;

				const response: AxiosResponse = await commands.executeCommand(
					"evomark-curling.executeRequest",
					requestSlug,
					requestMethod,
					collectionSlug,
					this._context
				);

				const [filename, payload] = await saveResponse(collectionSlug, requestSlug, requestMethod, response);

				BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
					type: "send",
					data: {
						response: payload,
						filename,
					},
				});
				// return new filename
				return;
			},
			async uploadFile(data: any) {
				const { fileName, fileContent } = data;
				const buffer = Buffer.from(fileContent, "base64");

				const directory = await getFileUploadsDirectory();
				let target = join(directory, fileName);
				target = await getUniqueFilePath(target);
				await writeFile(target, buffer);

				BasePanelClass.currentPanels.get("request")._panel.webview.postMessage({
					type: "uploadFile",
					data: {
						filename: basename(target),
					},
				});
				window.showInformationMessage("File uploaded");
				return;
			},
			async deleteFile(data: any) {
				const { filename } = data;
				const directory = await getFileUploadsDirectory();
				let target = join(directory, filename);
				await rm(target, {
					force: true,
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
