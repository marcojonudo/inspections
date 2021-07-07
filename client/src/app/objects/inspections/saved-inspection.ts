import {SavedItem} from './saved-items/saved-item';
import {Dayjs} from 'dayjs';

export class SavedInspection {

	name: string;
	orderNumber: number;
	employeeCode: string;
	numberPlate: string;
	items: SavedItem[];
	saved: Dayjs;

	constructor(name: string, orderNumber: number, numberPlate: string, items: SavedItem[]) {
		this.name = name;
		this.orderNumber = orderNumber;
		this.numberPlate = numberPlate;
		this.items = items;
	}

}
