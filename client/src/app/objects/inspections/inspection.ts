import {Item} from './items/item';

export class Inspection {

	name: string;
	items: Item[];

	constructor(inspection: any, items: Item[]) {
		this.name = inspection.name;
		this.items = items;
	}

}
