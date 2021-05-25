import {SavedItem} from './saved-item';
import {SelectItem} from '../items/select-item';
import * as dayjs from 'dayjs';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(item: SelectItem, employeeCode: string) {
		super(item, employeeCode);
		this.value = item.options.find(o => o.selected).name;
	}

	update(value: string): void {
		this.value = value;
		this.filled = dayjs();
	}

}
