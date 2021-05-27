import {SavedItem} from './saved-item';
import {SelectItem} from '../items/select-item';
import * as dayjs from 'dayjs';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(item: SelectItem, employeeCode: string, savedItem: SelectSavedItem) {
		super(item, employeeCode, savedItem);
		this.value = savedItem ? savedItem.value : item.options.find(o => o.selected).name;
	}

	update(value: string): void {
		this.value = value;
		this.filled = dayjs();
	}

	reset(): void {
		this.value = '';
		this.filled = undefined;
	}

}
