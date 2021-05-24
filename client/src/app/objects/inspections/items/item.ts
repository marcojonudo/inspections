import {ItemCategory} from '../item-category';
import {GaragePosition} from '../garage-position';
import {VehiclePosition} from '../vehicle-position';

export class Item {

	type: string;
	name: string;
	order: number;
	category: ItemCategory;
	garagePosition: GaragePosition;
	vehiclePositions: VehiclePosition[];

	constructor(item: any) {
		this.type = item.type;
		this.name = item.name;
		this.order = item.order;
		this.category = new ItemCategory(item.category);
		this.garagePosition = new GaragePosition(item.garagePosition);
		this.vehiclePositions = item.vehiclePositions.map(p => new VehiclePosition(p));
	}

}
