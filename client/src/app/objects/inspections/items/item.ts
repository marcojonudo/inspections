import { ItemCategory } from '../item-category';
import { ListElement } from '../../list-elements/list-element';
import { ItemRelation } from '../item-relation';
import { ItemVehicleData } from './item-vehicle-data';
import { ItemType } from './item-type';

export class Item implements ListElement {

	type: string;
	code: string;
	name: string;
	shortName: string;
	order: number;
	printOrder: number;
	category: ItemCategory;
	vehicleData: ItemVehicleData;
	relations: ItemRelation[];
	required: boolean;
	header: string;
	picture: boolean;
	print: boolean;

	constructor(item: any) {
		this.type = item.type;
		this.code = item.code;
		this.name = item.name;
		this.shortName = item.shortName;
		this.order = item.order;
		this.printOrder = item.printOrder;
		this.category = item.category ? new ItemCategory(item.category) : undefined;
		this.vehicleData = new ItemVehicleData(item.vehicleData);
		this.required = item.required;
		this.header = item.header;
		this.picture = item.picture;
		this.print = item.print;
	}

}
