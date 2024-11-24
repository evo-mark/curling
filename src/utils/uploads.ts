import { getWorkspaceRoot } from "./file";
import { join } from "node:path";

export const getFileUploadsDirectory = () => {
	const root = getWorkspaceRoot();
	return join(root, ".curling", "files");
};
