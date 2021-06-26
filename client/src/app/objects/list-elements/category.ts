import {ListElement} from './list-element';
import {NameElement} from './name-element';

export class Category implements ListElement {

	name: string;
	items: ListElement[];
	order: number;

	constructor(nameElement: NameElement, items: ListElement[]) {
		this.name = nameElement.name;
		this.items = items;
		this.order = nameElement.order;
	}

}
