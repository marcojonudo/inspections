import {SavedItem} from './saved-item';
import {TextItem} from '../items/text-item';

export class TextSavedItem extends SavedItem {

	text: string;

	constructor(item: TextItem, employeeCode: string, savedItem: TextSavedItem) {
		super(item, employeeCode, savedItem);
		this.text = savedItem?.text;
	}

	update(text: string, employeeCode: string): void {
		this.text = text;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.text = '';
		this.updateCommonFields(employeeCode);
	}

}
