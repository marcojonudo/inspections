import { SavedItem } from './saved-items/saved-item';
import { SavedInspectionData } from './saved-inspection-data';
import * as dayjs from 'dayjs';

export class SavedInspection {

	centre: number;
	inspectionTypeCode: string;
	vehicle: string;
	orderNumber: number;
	numberPlate: string;
	orderInspection: boolean;
	items: SavedItem[];
	data: SavedInspectionData[];

	constructor(savedInspection: any, items: SavedItem[], employeeCode: string) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.vehicle = savedInspection.vehicle;
		this.orderNumber = savedInspection.orderNumber;
		this.numberPlate = savedInspection.numberPlate;
		this.orderInspection = savedInspection.orderInspection;
		this.items = items;
		this.data = savedInspection.data.map(d => new SavedInspectionData(d.employeeCode, d.saved));
		this.data.push(new SavedInspectionData(employeeCode));
		this.items = items;
	}

	findData(): SavedInspectionData {
		return this.data[this.data.length - 1];
	}

	fillSaved(savedInspection: SavedInspection, employeeCode: string): void {
		this.findData().saved = dayjs(savedInspection.findData().saved);
		this.items.forEach(savedItem => {
			const s = savedInspection.items.find(i => i.item.code === savedItem.item.code);
			savedItem.findData().saved = dayjs(s.findData().saved);
		});
		this.addData(employeeCode);
	}

	addData(employeeCode: string): void {
		this.data.push(new SavedInspectionData(employeeCode));
	}

}
