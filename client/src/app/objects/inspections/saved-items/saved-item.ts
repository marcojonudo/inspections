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

	findLastData(data: SavedItemData[] = this.data): SavedItemData {
		return data.reduce((prev, current) => (prev.filled > current.filled) ? prev : current);
	}

	findData(employeeCode: string = undefined, replicate: boolean = false): SavedItemData {
		if (employeeCode && this.findLastData().saved) {
			this.addData(employeeCode, replicate);
		}
		return this.findLastData();
	}

	addData(employeeCode: string, replicate: boolean, item: Item = this.item): void {
		const itemType = ItemType.parse(item.type);
		const data = this.replicateData(itemType, item, employeeCode);
		this.data.push(data);
	}

	replicateData(itemType: ItemType, item: Item, employeeCode: string): SavedItemData {
		const lastData = this.findData();
		const data = itemType.buildData(employeeCode, lastData, item);
		data.saved = undefined;
		return data;
	}

	findValue(): string {
		return this.findData().findValue();
	}

	findImageId(): number {
		return this.findData().imageId;
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

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.findData(employeeCode, true).updateRestrictive(restrictive, employeeCode);
	}

	update(value: any, employeeCode: string): void {
		this.findData().update(value, employeeCode);
	}

	updateImageId(imageId: number, employeeCode: string): void {
		this.findData(employeeCode, true).updateImageId(imageId, employeeCode);
	}

}
