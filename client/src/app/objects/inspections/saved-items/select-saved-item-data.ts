import { Constants } from '../../constants';
import { SavedItemData } from './saved-item-data';
import { SelectItem } from '../items/select-item';

export class SelectSavedItemData extends SavedItemData {

	value: string;

	constructor(employeeCode: string, data: any, item: SelectItem) {
		super(employeeCode, data, item);
		this.value = data ? data.value : Constants.SELECT_ITEM_OPTION_CODE.P;
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
		this.imageId = undefined;
		this.updateCommonFields(employeeCode);
	}

}
