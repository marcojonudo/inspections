import {SavedItem} from './saved-item';
import {TextItem} from '../items/text-item';
import * as dayjs from 'dayjs';

export class TextSavedItem extends SavedItem {

	text: string;

	constructor(item: TextItem, employeeCode: string) {
		super(item, employeeCode);
		this.text = '';
	}

	update(text: string): void {
		this.text = text;
		this.filled = dayjs();
	}

}
