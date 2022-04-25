import { SavedItem } from './saved-items/saved-item';
import { Dayjs } from 'dayjs';

export class SavedInspection {

	inspectionTypeCode: string;
	vehicle: string;
	orderNumber: number;
	employeeCode: string;
	numberPlate: string;
	orderInspection: boolean;
	items: SavedItem[];
	saved: Dayjs;

	constructor(savedInspection: any, items: SavedItem[]) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.vehicle = savedInspection.vehicle;
		this.orderNumber = savedInspection.orderNumber;
		this.numberPlate = savedInspection.numberPlate;
		this.orderInspection = savedInspection.orderInspection;
		this.employeeCode = savedInspection.employeeCode;
		this.items = items;
	}

}
