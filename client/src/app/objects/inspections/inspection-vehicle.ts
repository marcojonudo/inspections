import { Item } from './items/item';
import { InspectionType } from './inspection-type';
import { ItemType } from './items/item-type';

export class InspectionVehicle {

	inspectionType: InspectionType;
	vehicle: string;
	items: Item[];
	orderInspection: boolean;

	constructor(inspectionVehicle: any) {
		this.inspectionType = new InspectionType(inspectionVehicle.inspectionType);
		this.vehicle = inspectionVehicle.vehicle;
		this.items = inspectionVehicle.items.map(item => ItemType.parse(item.type).build(item));
		this.orderInspection = inspectionVehicle.orderInspection;
	}

}
