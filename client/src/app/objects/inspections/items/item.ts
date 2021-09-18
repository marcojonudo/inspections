import { ItemCategory } from '../item-category';
import { ListElement } from '../../list-elements/list-element';
import { ItemRelation } from '../item-relation';
import { ItemVehicleData } from './item-vehicle-data';

export class Item implements ListElement {

	type: string;
	code: string;
	name: string;
	order: number;
	printOrder: number;
	category: ItemCategory;
	vehicleData: ItemVehicleData;
	relations: ItemRelation[];
	required: boolean;
	header: string;

	constructor(item: any) {
		this.type = item.type;
		this.code = item.code;
		this.name = item.name;
		this.order = item.order;
		this.printOrder = item.printOrder;
		this.category = item.category ? new ItemCategory(item.category) : undefined;
		this.vehicleData = new ItemVehicleData(item.vehicleData);
		this.required = item.required;
		this.header = item.header;
	}

}
