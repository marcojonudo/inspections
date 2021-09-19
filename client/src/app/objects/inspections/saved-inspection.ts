import { SavedItem } from './saved-items/saved-item';
import { Dayjs } from 'dayjs';

export class SavedInspection {

	inspectionTypeCode: string;
	vehicle: string;
	orderNumber: number;
	employeeCode: string;
	numberPlate: string;
	items: SavedItem[];
	saved: Dayjs;

	constructor(
		inspectionTypeCode: string, vehicle: string, orderNumber: number, numberPlate: string, items: SavedItem[]
	) {
		this.inspectionTypeCode = inspectionTypeCode;
		this.vehicle = vehicle;
		this.orderNumber = orderNumber;
		this.numberPlate = numberPlate;
		this.items = items;
	}

}
