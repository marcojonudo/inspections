import { Item } from '../items/item';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { CustomImage } from '../custom-image';

export abstract class SavedItem {

	item: Item;
	employeeCode: string;
	hidden: boolean;
	image: CustomImage;
	filled: Dayjs;
	restrictive: boolean;

	protected constructor(item: Item, employeeCode: string, savedItem: any) {
		this.item = item;
		this.employeeCode = employeeCode;
		if (savedItem) {
			this.image = savedItem.image ? new CustomImage(savedItem.image.image, savedItem.image.landscape) : undefined;
			this.filled = savedItem.filled ? dayjs(savedItem.filled) : undefined;
			this.hidden = savedItem.hidden;
			this.restrictive = savedItem.restrictive;
		}
	}

	abstract findValue(): string;

	abstract isFilled(): boolean;

	abstract update(value: string, employeeCode: string): void;

	abstract reset(employeeCode: string): void;

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.hidden = hidden;
		this.reset(employeeCode);
	}

	updateCommonFields(employeeCode: string): void {
		this.employeeCode = employeeCode;
		this.filled = dayjs();
	}

	addImage(image: CustomImage, employeeCode: string): void {
		this.image = image;
		this.updateCommonFields(employeeCode);
	}

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.restrictive = restrictive;
		this.updateCommonFields(employeeCode);
	}

}
