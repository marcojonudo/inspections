import {SavedInspection} from './inspections/saved-inspection';
import {Inspection} from './inspections/inspection';
import {TextItem} from './inspections/items/text-item';
import {TextSavedItem} from './inspections/saved-items/text-saved-item';
import {SelectItem} from './inspections/items/select-item';
import {SelectSavedItem} from './inspections/saved-items/select-saved-item';
import {TextAreaItem} from './inspections/items/text-area-item';
import {Item} from './inspections/items/item';
import {SavedItem} from './inspections/saved-items/saved-item';
import {ItemRelation} from './inspections/item-relation';

export class Builder {

	static itemBuilder: { [key: string]: ((item: any) => Item) } = {
		TEXT: (item: any) => new TextItem(item),
		SELECT: (item: any) => new SelectItem(item),
		TEXT_AREA: (item: any) => new TextAreaItem(item)
	};

	static savedItemBuilder: { [key: string]: ((item: Item, employeeCode: string, savedItem: SavedItem) => SavedItem) } = {
		TEXT: (item: TextItem, employeeCode: string, savedItem: TextSavedItem) =>
			new TextSavedItem(item, employeeCode, savedItem),
		SELECT: (item: SelectItem, employeeCode: string, savedItem: SelectSavedItem) =>
			new SelectSavedItem(item, employeeCode, savedItem),
		TEXT_AREA: (item: TextItem, employeeCode: string, savedItem: TextSavedItem) =>
			new TextSavedItem(item, employeeCode, savedItem)
	};

	static buildInspection(inspection: any): Inspection {
		const items = inspection.items.map(item => this.itemBuilder[item.type](item));
		items.forEach(item => {
			const baseItem = inspection.items.find(i => i.name === item.name);
			item.relations = baseItem.relations.map(itemRelation =>
				new ItemRelation(itemRelation, items.find(i => i.name === itemRelation.targetItem.name))
			);
		});
		return new Inspection(inspection.name, items);
	}

	static buildSavedInspection(
		inspection: Inspection, employeeCode: string, orderNumber: number, numberPlate: string
	): SavedInspection {
		const savedItems = inspection.items.map(item => this.savedItemBuilder[item.type](item, employeeCode, undefined));
		return new SavedInspection(inspection.name, orderNumber, numberPlate, savedItems);
	}

	static loadSavedInspection(savedInspection: any): SavedInspection {
		const savedItems = savedInspection.items.map(savedItem =>
			this.savedItemBuilder[savedItem.item.type](savedItem.item, savedItem.employeeCode, savedItem)
		);
		return new SavedInspection(
			savedInspection.name, savedInspection.orderNumber, savedInspection.numberPlate, savedItems
		);
	}

}
