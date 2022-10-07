import { SavedItem } from './saved-items/saved-item';
import { SavedInspectionData } from './saved-inspection-data';
import * as dayjs from 'dayjs';
import { Constants } from '../constants';

export class SavedInspection {

	centre: number;
	inspectionTypeCode: string;
	vehicle: string;
	orderNumber: number;
	numberPlate: string;
	orderInspection: boolean;
	items: SavedItem[];
	data: SavedInspectionData[];

	constructor(savedInspection: any, items: SavedItem[]) {
		this.inspectionTypeCode = savedInspection.inspectionTypeCode;
		this.vehicle = savedInspection.vehicle;
		this.orderNumber = savedInspection.orderNumber;
		this.numberPlate = savedInspection.numberPlate;
		this.orderInspection = savedInspection.orderInspection;
		this.data = savedInspection.data.map(d => new SavedInspectionData(d.employeeCode, d.reason, dayjs(d.saved)));
		this.items = items;
	}

	findData(): SavedInspectionData {
		return this.data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2);
	}

	restoreSaved(): void {
		const maxSavedItem = this.data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2);
		const i = this.data.indexOf(maxSavedItem);
		this.data.splice(i, 1);
		this.items.forEach(savedItem => {
			savedItem.findData().saved = undefined;
		});
	}

	addData(employeeCode: string): void {
		const maxSaved = dayjs(Math.max(...this.data.map(d => d.saved.valueOf())));
		const now = dayjs();
		/* Puede darse el caso de que, si se guarda muy rápido la revisión, se de clic al botón por segunda vez en el
		 * mismo segundo. En ese caso, se suma un segundo a la fecha para evitar duplicados */
		const saved = now.diff(maxSaved, 's') > 0 ? now : maxSaved.add(1, 's');
		this.data.push(new SavedInspectionData(employeeCode, Constants.REASON.UPDATED, saved));
		this.items.filter(i => !i.findData().saved).forEach(i => {
			i.findData().saved = dayjs(this.findData().saved);
		});
	}

}
