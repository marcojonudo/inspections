import {Item} from './items/item';

export class Inspection {

	name: string;
	items: Item[];

	constructor(inspectionName: string, items: Item[]) {
		this.name = inspectionName;
		this.items = items;
	}

}
