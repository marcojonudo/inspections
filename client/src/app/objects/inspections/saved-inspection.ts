import {SavedItem} from './saved-items/saved-item';
import {Dayjs} from 'dayjs';

export class SavedInspection {

	code: string;
	name: string;
	orderNumber: number;
	employeeCode: string;
	numberPlate: string;
	items: SavedItem[];
	saved: Dayjs;

	constructor(code: string, name: string, orderNumber: number, numberPlate: string, items: SavedItem[]) {
		this.code = code;
		this.name = name;
		this.orderNumber = orderNumber;
		this.numberPlate = numberPlate;
		this.items = items;
	}

}
