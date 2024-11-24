import kebabCase from "lodash.kebabcase";

export function slugify(input: string): string {
	return kebabCase(input).replace(/&/g, "-and-");
}
