import {SavedItem} from './saved-items/saved-item';
import {Dayjs} from 'dayjs';

export class SavedInspection {

	name: string;
	orderNumber: number;
	items: SavedItem[];
	saved: Dayjs;

	constructor(name: string, orderNumber: number, items: SavedItem[]) {
		this.name = name;
		this.orderNumber = orderNumber;
		this.items = items;
	}

}
