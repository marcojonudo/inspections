import {Item} from './items/item';

export class Inspection {

	code: string;
	name: string;
	items: Item[];

	constructor(code: string, name: string, items: Item[]) {
		this.code = code;
		this.name = name;
		this.items = items;
	}

}
