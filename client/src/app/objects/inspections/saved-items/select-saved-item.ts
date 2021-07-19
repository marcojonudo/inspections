import {SavedItem} from './saved-item';
import {SelectItem} from '../items/select-item';
import {Constants} from '../../constants';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(item: SelectItem, employeeCode: string, savedItem: SelectSavedItem) {
		super(item, employeeCode, savedItem);
		this.value = savedItem ?
			savedItem.value :
			item.options.find(o => o.order === Constants.SELECT_ITEM_OPTION_MIN_ORDER).name;
	}

	findValue(): string {
		return this.value;
	}

	update(value: string, employeeCode: string): void {
		this.value = value;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string, item: SelectItem): void {
		this.value = item.options.find(o => o.order === Constants.SELECT_ITEM_OPTION_MIN_ORDER).name;
		this.updateCommonFields(employeeCode);
	}

}
