import { SavedInspection } from './inspections/saved-inspection';
import { InspectionVehicle } from './inspections/inspection-vehicle';
import { TextItem } from './inspections/items/text-item';
import { TextSavedItem } from './inspections/saved-items/text-saved-item';
import { SelectItem } from './inspections/items/select-item';
import { SelectSavedItem } from './inspections/saved-items/select-saved-item';
import { TextAreaItem } from './inspections/items/text-area-item';
import { Item } from './inspections/items/item';
import { SavedItem } from './inspections/saved-items/saved-item';
import { ItemRelation } from './inspections/item-relation';
import { Category } from './list-elements/category';
import { NameElement } from './list-elements/name-element';
import { ListElement } from './list-elements/list-element';
import { Car } from './orders/vehicles/car';
import { Scooter } from './orders/vehicles/scooter';
import { Vehicle } from './orders/vehicles/vehicle';
import { TextAreaSavedItem } from './inspections/saved-items/text-area-saved-item';

export class Builder {

	static itemBuilder: { [key: string]: ((item: any) => Item) } = {
		TEXT: (item: any) => new TextItem(item),
		SELECT: (item: any) => new SelectItem(item),
		TEXT_AREA: (item: any) => new TextAreaItem(item)
	};

	static vehicleBuilder: { [key: string]: ((vehicle: any) => Vehicle) } = {
		CAR: (vehicle: any) => new Car(vehicle),
		SCOOTER: (vehicle: any) => new Scooter(vehicle)
	};

	static savedItemBuilder: { [key: string]: ((item: Item, employeeCode: string, savedItem: SavedItem) => SavedItem) } = {
		TEXT: (item: TextItem, employeeCode: string, savedItem: any) =>
			new TextSavedItem(item, employeeCode, savedItem),
		SELECT: (item: SelectItem, employeeCode: string, savedItem: any) =>
			new SelectSavedItem(item, employeeCode, savedItem),
		TEXT_AREA: (item: TextAreaItem, employeeCode: string, savedItem: any) =>
			new TextAreaSavedItem(item, employeeCode, savedItem)
	};

	static buildInspection(inspection: any): InspectionVehicle {
		const items = inspection.items.map(item => this.itemBuilder[item.type](item));
		items.forEach(item => {
			const baseItem = inspection.items.find(i => i.name === item.name);
			item.relations = [];
			baseItem.relations.forEach(itemRelation => {
				const targetItem = items.find(i => i.name === itemRelation.targetItem.name);
				/* En algunas revisiones (como de patinete), puede que no estén los target items de las relaciones. En
				 * esos casos, no se añade la relación */
				if (targetItem) {
					item.relations.push(new ItemRelation(itemRelation, targetItem));
				}
			});
		});
		return new InspectionVehicle(inspection, items);
	}

	static buildSavedInspection(
		inspection: InspectionVehicle, employeeCode: string, orderNumber: number, numberPlate: string
	): SavedInspection {
		const savedItems = inspection.items.map(item => this.savedItemBuilder[item.type](item, employeeCode, undefined));
		return new SavedInspection(
			inspection.inspectionType.code,
			inspection.vehicle,
			orderNumber,
			numberPlate,
			inspection.orderInspection,
			savedItems
		);
	}

	static loadSavedInspection(savedInspection: any, items: Item[], employeeCode: string): SavedInspection {
		const savedItems = items.map(item => {
			const savedItem = savedInspection.items.find(i => i.item.code === item.code);
			return this.savedItemBuilder[item.type](item, employeeCode, savedItem);
		});
		return new SavedInspection(
			savedInspection.inspectionTypeCode,
			savedInspection.vehicle,
			savedInspection.orderNumber,
			savedInspection.numberPlate,
			savedInspection.orderInspection,
			savedItems,
			savedInspection.employeeCode
		);
	}

	static buildCategory(category: Category, items: ListElement[] = []): Category {
		return new Category(
			new NameElement({ code: category.code, name: category.name, order: category.order }), items
		);
	}

	static buildVehicle(vehicle: any): Vehicle {
		return this.vehicleBuilder[vehicle.type](vehicle);
	}

}
