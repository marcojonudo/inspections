import {SavedItem} from './saved-item';
import {SelectItem} from '../items/select-item';
import {Constants} from '../../constants';

export class SelectSavedItem extends SavedItem {

	value: string;

	constructor(item: SelectItem, employeeCode: string, savedItem: SelectSavedItem) {
		super(item, employeeCode, savedItem);
		this.value = savedItem ? savedItem.value : Constants.SELECT_ITEM_OPTION_CODE.P;
	}

	findValue(): string {
		return this.value;
	}

	isFilled(): boolean {
		return this.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.P;
	}

	update(value: string, employeeCode: string): void {
		this.value = value;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.value = Constants.SELECT_ITEM_OPTION_CODE.P;
		this.updateCommonFields(employeeCode);
	}

}
