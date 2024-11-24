import { resolve } from "node:path";
import { defineConfig } from "vite";
import vscode from "@tomjs/vite-plugin-vscode";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		minify: false,
		rollupOptions: {
			input: {
				collection: resolve(__dirname, "src/webviews/collection/index.html"),
				request: resolve(__dirname, "src/webviews/request/index.html"),
			},
			output: {
				// https://rollupjs.org/configuration-options/#output-manualchunks
				manualChunks: (id) => {},
			},
		},
	},
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith("vscode-"),
				},
			},
		}),
		vscode({
			extension: { entry: "src/index.ts" },
		}),
		// Modify the extension source code entry path, and also modify the `index.html` entry file path
		// vscode({ extension: { entry: 'src/index.ts' } }),
	],
});
