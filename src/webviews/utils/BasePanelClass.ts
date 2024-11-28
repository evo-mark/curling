import { Disposable, ExtensionContext, WebviewPanel, Webview, SecretStorage } from "vscode";

interface PageOptions {
	url: string;
	args?: Record<string, unknown>;
	name?: string;
}

export abstract class BasePanelClass {
	public panelName: string;
	public static currentPanel: BasePanelClass | undefined;
	public static currentPanels: Map<string, BasePanelClass | undefined> = new Map();
	public readonly _panel: WebviewPanel;
	public readonly _context: ExtensionContext;
	public _disposables: Disposable[] = [];

	constructor(panel: WebviewPanel, context: ExtensionContext, url: string, name: string) {
		this._panel = panel;
		this._context = context;

		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
		this._panel.webview.html = BasePanelClass.setupPage(this._panel.webview, context, {
			url,
			name,
		});

		BasePanelClass.setupWebviewHooks(this._panel.webview, this._disposables, this.getApi());
	}

	/**
	 * Cleans up and disposes of webview resources when the webview panel is closed.
	 */
	public dispose() {
		BasePanelClass.currentPanels.set(this.panelName, undefined);

		// Dispose of the current webview panel
		this._panel.dispose();

		// Dispose of all disposables (i.e. commands) for the current webview panel
		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	public static setupPage(
		webview: Webview,
		context: ExtensionContext,
		{ url = "", name = null } = {} as PageOptions
	) {
		let html = process.env.VITE_DEV_SERVER_URL
			? __getWebviewHtml__(`${process.env.VITE_DEV_SERVER_URL}${url}`)
			: __getWebviewHtml__(webview, context, name);

		const insert = `<script>window.addEventListener('DOMContentLoaded', () => {
        window.addEventListener("message", (event) => {
            const { type, data } = event.data.data;
            if (type === "keydown") {
                window.dispatchEvent(new KeyboardEvent("keydown", data));
            }
        });
        for (const command of ['selectAll', 'copy', 'paste', 'cut', 'undo', 'redo']) {
            document.addEventListener(command, (e) => {
                console.log(e.clipboardData.getData("text"));
              document.getElementById('webview-patch-iframe').contentWindow.postMessage({'command': 'execCommand', 'data': command}, '*');
            });
          }
        });</script></head>`;

		html = html.replace("</head>", insert);

		return html;
	}

	public static setupWebviewHooks(
		webview: Webview,
		disposables: Disposable[],
		api: Record<string, (message: MessageEvent) => void> = {}
	) {
		webview.onDidReceiveMessage(
			(message: any) => {
				const type = message.type;

				if (!api[type]) return;

				const bound = api[type].bind(webview);
				return bound(message.data);
			},
			undefined,
			disposables
		);
	}

	public abstract getApi(): Record<string, (message: unknown) => unknown>;
}
