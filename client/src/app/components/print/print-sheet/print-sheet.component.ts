import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Constants } from '../../../objects/constants';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/orders/centre';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../../objects/inspections/saved-items/text-saved-item';
import { SelectItem } from '../../../objects/inspections/items/select-item';
import { ItemType } from '../../../objects/inspections/items/item-type';
import { TextAreaSavedItem } from '../../../objects/inspections/saved-items/text-area-saved-item';
import { TextItem } from '../../../objects/inspections/items/text-item';
import { CategoryItems } from '../../../objects/print/category-items';
import { VehicleType } from '../../../objects/orders/vehicles/vehicle-type';
import { Item } from '../../../objects/inspections/items/item';

@Component({
	selector: 'app-print-sheet',
	templateUrl: './print-sheet.component.html',
	styleUrls: ['./print-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintSheetComponent {

	@Input() categories: CategoryItems[];
	@Input() vehicleType: VehicleType;

	// region Getters / setters

	get savedInspection(): SavedInspection {
		return InspectionService.savedInspection;
	}

	get order(): Order {
		return InspectionService.order;
	}

	get centre(): Centre {
		return InspectionService.centre;
	}

	get selectType(): string {
		return ItemType.SELECT.id;
	}

	get headerVehicleItem(): string {
		return Constants.HEADER_CARD.VEHICLE;
	}

	// endregion

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectSavedItem(item: SavedItem): SelectSavedItem {
		return item as SelectSavedItem;
	}

	findTextSavedItem(item: SavedItem): TextSavedItem {
		return item as TextSavedItem;
	}

	findTextAreaSavedItem(item: SavedItem): TextAreaSavedItem {
		return item as TextAreaSavedItem;
	}

	checkMultipleFieldsItem(savedItem: SavedItem): boolean {
		return savedItem.item.type === ItemType.TEXT.id && this.findTextSavedItem(savedItem).fields.length > 2;
	}

	findTextItemUnit(item: SavedItem): string {
		return this.findTextSavedItem(item).isFilled() ? (item.item as TextItem).unit || '' : '';
	}

	findSelectIcon(item: SelectSavedItem): string {
		return (item.item as SelectItem).options.find(option => option.code === item.value).printIcon;
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findTextAreaLines(item: TextAreaSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	findItemName(item: Item): string {
		return item.shortName || item.name;
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== ItemType.SELECT.id) {
			return false;
		}
		return (savedItem as SelectSavedItem).value !== Constants.SELECT_ITEM_OPTION_CODE.C;
	}

}
