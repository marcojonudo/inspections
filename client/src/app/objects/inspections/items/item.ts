import {ItemCategory} from '../item-category';
import {GaragePosition} from '../garage-position';
import {VehicleSection} from '../vehicle-section';
import {ListElement} from '../../list-elements/list-element';
import {ItemRelation} from '../item-relation';

export class Item implements ListElement {

	type: string;
	code: string;
	name: string;
	order: number;
	category: ItemCategory;
	garagePosition: GaragePosition;
	vehicleSection: VehicleSection;
	relations: ItemRelation[];
	required: boolean;

	constructor(item: any) {
		this.type = item.type;
		this.code = item.code;
		this.name = item.name;
		this.order = item.order;
		this.category = item.category ? new ItemCategory(item.category) : undefined;
		this.garagePosition = item.garagePosition ? new GaragePosition(item.garagePosition) : undefined;
		this.vehicleSection = item.vehicleSection ? new VehicleSection(item.vehicleSection) : undefined;
		this.required = item.required;
	}

}
