import {ItemCategory} from '../item-category';
import {GaragePosition} from '../garage-position';
import {VehiclePosition} from '../vehicle-position';

export class Item {

	type: string;
	name: string;
	category: ItemCategory;
	garagePositions: GaragePosition[];
	vehiclePositions: VehiclePosition[];

	constructor(item: any) {
		this.type = item.type;
		this.name = item.name;
		this.category = new ItemCategory(item.category);
		this.garagePositions = item.garagePositions.map(p => new GaragePosition(p));
		this.vehiclePositions = item.vehiclePositions.map(p => new VehiclePosition(p));
	}

}
