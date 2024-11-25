import { checkFileExists, getWorkspaceRoot } from "./file";
import { join } from "node:path";
import { mkdir } from "node:fs/promises";

export const getFileUploadsDirectory = async () => {
	const root = getWorkspaceRoot();
	const target = join(root, ".curling", "files");

	const exists = await checkFileExists(target);
	if (!exists) {
		await mkdir(target, {
			recursive: true,
		});
	}
	return target;
};
