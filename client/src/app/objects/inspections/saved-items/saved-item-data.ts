import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { CustomImage } from '../custom-image';
import { Item } from '../items/item';

export abstract class SavedItemData {

	employeeCode: string;
	hidden: boolean;
	image: CustomImage;
	restrictive: boolean;
	filled: Dayjs;
	saved: Dayjs;
	itemType: string;

	protected constructor(employeeCode: string, savedData: any, item: Item) {
		this.employeeCode = employeeCode;
		this.itemType = item.type;
		if (savedData) {
			this.image = savedData.image ? new CustomImage(savedData.image.image, savedData.image.landscape) : undefined;
			this.filled = savedData.filled ? dayjs(savedData.filled) : undefined;
			this.hidden = savedData.hidden;
			this.restrictive = savedData.restrictive;
			this.saved = dayjs(savedData.saved);
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

	addImage(image: CustomImage, employeeCode: string): void {
		this.image = image;
		this.updateCommonFields(employeeCode);
	}

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.restrictive = restrictive;
		this.updateCommonFields(employeeCode);
	}

}
