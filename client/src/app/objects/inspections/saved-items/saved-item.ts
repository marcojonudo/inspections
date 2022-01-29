import { Item } from '../items/item';
import { CustomImage } from '../custom-image';
import { ItemType } from '../items/item-type';
import { SavedItemData } from './saved-item-data';

export class SavedItem {

	type: string;
	code: string;
	item: Item;
	data: SavedItemData[];

	constructor(item: Item, employeeCode: string, savedItem: any) {
		this.item = item;
		this.type = item.type;
		this.code = item.code;
		const itemType = ItemType.parse(item.type);
		if (savedItem) {
			this.data = savedItem.data.map(d => itemType.buildData(d.employeeCode, d, item));
		} else {
			this.data = [itemType.buildData(employeeCode, undefined, item)];
		}
	}

	isHidden(): boolean {
		return this.findData().hidden;
	}

	isFilled(): boolean {
		return this.findData().isFilled();
	}

	findData(employeeCode: string = undefined): SavedItemData {
		if (employeeCode && this.data[this.data.length - 1].saved) {
			this.addData(employeeCode);
		}
		return this.data[this.data.length - 1];
	}

	addData(employeeCode: string, item: Item = this.item): void {
		const itemType = ItemType.parse(item.type);
		this.data.push(itemType.buildData(employeeCode, undefined, item));
	}

	findValue(): string {
		return this.findData().findValue();
	}

	findImage(): CustomImage {
		return this.findData().image;
	}

	findRestrictive(): boolean {
		return this.findData().restrictive;
	}

	findEmployeeCode(): string {
		return this.findData().employeeCode;
	}

	updateHidden(employeeCode: string, hidden: boolean): void {
		this.findData().updateHidden(employeeCode, hidden);
	}

	addImage(image: CustomImage, employeeCode: string): void {
		this.findData().addImage(image, employeeCode);
	}

	addImageId(imageId: number, employeeCode: string): void {
		// this.imageId = imageId;
		// this.updateCommonFields(employeeCode);
	}

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.findData().updateRestrictive(restrictive, employeeCode);
	}

	update(value: any, employeeCode: string): void {
		this.findData().update(value, employeeCode);
	}

}
