import {Item} from '../items/item';
import {Dayjs} from 'dayjs';
import * as dayjs from 'dayjs';

export abstract class SavedItem {

	item: Item;
	employeeCode: string;
	filled: Dayjs;

	protected constructor(item: Item, employeeCode: string, savedItem: SavedItem) {
		this.item = item;
		this.employeeCode = employeeCode;
		this.filled = savedItem ? dayjs(savedItem.filled) : dayjs();
	}

	abstract update(value: string, employeeCode: string): void;

	abstract reset(employeeCode: string, item: Item): void;

	updateCommonFields(employeeCode: string): void {
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

}
