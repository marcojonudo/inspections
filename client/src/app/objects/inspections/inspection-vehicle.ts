import { Item } from './items/item';
import { InspectionType } from './inspection-type';

export class InspectionVehicle {

	inspectionType: InspectionType;
	vehicle: string;
	items: Item[];

	constructor(inspectionVehicle: any, items: Item[]) {
		this.inspectionType = new InspectionType(inspectionVehicle.inspectionType);
		this.vehicle = inspectionVehicle.vehicle;
		this.items = items;
	}

}
