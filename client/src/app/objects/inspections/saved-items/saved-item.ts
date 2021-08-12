import {Item} from '../items/item';
import {Dayjs} from 'dayjs';
import * as dayjs from 'dayjs';

export abstract class SavedItem {

	item: Item;
	employeeCode: string;
	hidden: boolean;
	image: string;
	filled: Dayjs;

	protected constructor(item: Item, employeeCode: string, savedItem: SavedItem) {
		this.item = item;
		this.employeeCode = employeeCode;
		if (savedItem) {
			this.image = savedItem.image;
			this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
			this.hidden = savedItem.hidden;
		}
	}

	abstract findValue(): string;

	abstract isFilled(): boolean;

	abstract update(value: string, employeeCode: string): void;

	abstract reset(employeeCode: string): void;

	toggleHidden(employeeCode: string): void {
		this.hidden = !this.hidden;
		this.reset(employeeCode);
	}

	updateCommonFields(employeeCode: string): void {
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

	addImage(image: string, employeeCode: string): void {
		this.image = image;
		this.updateCommonFields(employeeCode);
	}

}
