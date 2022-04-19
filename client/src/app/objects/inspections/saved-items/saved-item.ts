import { Item } from '../items/item';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export abstract class SavedItem {

	type: string;
	code: string;
	item: Item;
	employeeCode: string;
	hidden: boolean;
	imageId: number;
	filled: Dayjs;
	restrictive: boolean;

	protected constructor(item: Item, employeeCode: string, savedItem: any) {
		this.item = item;
		this.type = item.type;
		this.code = item.code;
		this.employeeCode = employeeCode;
		if (savedItem) {
			this.employeeCode = savedItem.employeeCode;
			this.imageId = savedItem.imageId;
			this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
			this.hidden = savedItem.hidden;
			this.restrictive = savedItem.restrictive;
		}
	}

	abstract findValue(): string;

	abstract isFilled(): boolean;

	abstract update(value: any, employeeCode: string): void;

	abstract reset(employeeCode: string): void;

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.hidden = hidden;
		this.reset(employeeCode);
	}

	updateCommonFields(employeeCode: string): void {
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

	addImageId(imageId: number, employeeCode: string): void {
		this.imageId = imageId;
		this.updateCommonFields(employeeCode);
	}

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.restrictive = restrictive;
		this.updateCommonFields(employeeCode);
	}

}
