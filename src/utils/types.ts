export interface CurlingScripts {
	pre: string;
	preError: string;
	post: string;
	postError: string;
}

export interface CurlingVariable {
	name: string;
	value: string;
	active: boolean;
}

export interface CurlingHeader extends CurlingVariable {}
