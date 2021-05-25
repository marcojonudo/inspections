import {Item} from '../items/item';
import {Dayjs} from 'dayjs';
import * as dayjs from 'dayjs';

export abstract class SavedItem {

	item: Item;
	employeeCode: string;
	filled: Dayjs;

	protected constructor(item: Item, employeeCode: string) {
		this.item = item;
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

	abstract update(value: string): void;

}
