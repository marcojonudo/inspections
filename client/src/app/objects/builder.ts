import {SavedInspection} from './inspections/saved-inspection';
import {Inspection} from './inspections/inspection';
import {TextItem} from './inspections/items/text-item';
import {TextSavedItem} from './inspections/saved-items/text-saved-item';
import {SelectItem} from './inspections/items/select-item';
import {SelectSavedItem} from './inspections/saved-items/select-saved-item';
import {TextAreaItem} from './inspections/items/text-area-item';

export class Builder {

	static itemBuilder: any = {
		TEXT: (item: any) => new TextItem(item),
		SELECT: (item: any) => new SelectItem(item),
		TEXT_AREA: (item: any) => new TextAreaItem(item)
	};

	static savedItemBuilder: any = {
		TEXT: (item: TextItem, employeeCode: string, savedItem: TextSavedItem) =>
			new TextSavedItem(item, employeeCode, savedItem),
		SELECT: (item: SelectItem, employeeCode: string, savedItem: SelectSavedItem) =>
			new SelectSavedItem(item, employeeCode, savedItem),
		TEXT_AREA: (item: TextItem, employeeCode: string, savedItem: TextSavedItem) =>
			new TextSavedItem(item, employeeCode, savedItem)
	};

	static buildInspection(inspection: any): Inspection {
		const items = inspection.items.map(item => this.itemBuilder[item.type](item));
		return new Inspection(inspection.name, items);
	}

	static buildSavedInspection(inspection: Inspection, employeeCode: string, orderNumber: number): SavedInspection {
		const savedItems = inspection.items.map(item => this.savedItemBuilder[item.type](item, employeeCode));
		return new SavedInspection(inspection.name, orderNumber, savedItems);
	}

	static loadSavedInspection(savedInspection: any): SavedInspection {
		const savedItems = savedInspection.items.map(savedItem =>
			this.savedItemBuilder[savedItem.item.type](savedItem.item, savedItem.employeeCode, savedItem)
		);
		return new SavedInspection(savedInspection.name, savedInspection.orderNumber, savedItems);
	}

}
