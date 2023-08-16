import { Item } from '../items/item';
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
		const savedData = data.filter(d => d.saved);
		/* Si todos los elementos tienen saved, se obtiene en último que se haya guardado (y por tanto, con el valor más
		 * reciente). Si no, se obtiene aquel que no tenga saved (y por tanto, no se haya guardado aún) */
		return savedData.length === data.length ?
			data.reduce((d1, d2) => d1.saved > d2.saved ? d1 : d2) :
			data.find(d => !d.saved);
	}

	findData(employeeCode: string = undefined): SavedItemData {
		/* Si hay código de empleado, y los últimos datos ya están guardados, significa que se debe crear un registro
		 * nuevo para el item */
		if (employeeCode && this.findLastData().saved) {
			this.addData(employeeCode);
		}
		return this.findLastData();
	}

	addData(employeeCode: string, item: Item = this.item): void {
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
		if (this.findData().hidden !== hidden) {
			this.findData().updateHidden(employeeCode, hidden);
		}
	}

	updateRestrictive(restrictive: boolean, employeeCode: string): void {
		this.findData(employeeCode).updateRestrictive(restrictive, employeeCode);
	}

	update(value: any, employeeCode: string): void {
		this.findData().update(value, employeeCode);
	}

	updateImageId(imageId: number, employeeCode: string): void {
		this.findData(employeeCode).updateImageId(imageId, employeeCode);
	}

}
