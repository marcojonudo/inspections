import {SavedItem} from './saved-item';
import { TextAreaItem } from '../items/text-area-item';

export class TextAreaSavedItem extends SavedItem {

	text: string;

	constructor(item: TextAreaItem, employeeCode: string, savedItem: any) {
		super(item, employeeCode, savedItem);
		this.text = savedItem?.text;
	}

	findValue(): string {
		return this.text;
	}

	isFilled(): boolean {
		return this.findValue() !== undefined && this.findValue() !== '';
	}

	update(text: string, employeeCode: string): void {
		this.text = text;
		this.updateCommonFields(employeeCode);
	}

	reset(employeeCode: string): void {
		this.text = undefined;
		this.imageId = undefined;
		this.updateCommonFields(employeeCode);
	}

}
