import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ListElement } from '../../../objects/list-elements/list-element';
import { Constants } from '../../../objects/constants';
import { PrintService } from '../../../services/print.service';
import { OrderPipe } from '../../../pipes/order.pipe';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/orders/centre';
import { Category } from '../../../objects/list-elements/category';
import { Builder } from '../../../objects/builder';
import { Utils } from '../../../objects/utils';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../../objects/inspections/saved-items/text-saved-item';
import { SelectItem } from '../../../objects/inspections/items/select-item';
import { ItemType } from '../../../objects/inspections/items/item-type';
import { TextAreaSavedItem } from '../../../objects/inspections/saved-items/text-area-saved-item';
import { TextItem } from '../../../objects/inspections/items/text-item';

@Component({
	selector: 'app-print-sheet',
	templateUrl: './print-sheet.component.html',
	styleUrls: ['./print-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintSheetComponent {

	private readonly ROW_ITEMS = 4;
	private readonly BASE_TOP = 183;
	private readonly HEADER_ROW_TOP = 16;

	listElements: ListElement[];
	imageListElements: { listElement, pageBreak }[];

	constructor(private printService: PrintService, private orderPipe: OrderPipe) {
		const items = InspectionService.inspectionHandler.findSavedItems(this.savedInspection)
			.filter(i => i.item.header === undefined)
			.filter(i => {
				const selectItem = i.item.type === ItemType.SELECT.id;
				return selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true;
			});
		this.listElements = InspectionService.findGroupedItems(
			items, 0, [(savedItem: SavedItem) => savedItem.item.category]
		);
		this.imageListElements = this.findImageElements();
	}

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

	findImageElements(): { listElement, pageBreak }[] {
		const splittedImageListElements = [];
		const imageListElements = InspectionService.findGroupedItems(
			InspectionService.savedInspection.items.filter(i => i.image),
			0,
			[(savedItem: SavedItem) => savedItem.item.category]
		);
		let row = 0;
		this.orderPipe.transform(imageListElements).forEach(listElement => {
			if (this.checkCategoryElement(listElement)) {
				const refCategory = listElement as Category;
				let category = Builder.buildCategory(refCategory);

				Utils.collate(refCategory.items, this.ROW_ITEMS).forEach(items => {
					category.items.push(...items);
					row++;

					const breakPage = this.checkBreak(row);
					if (breakPage) {
						splittedImageListElements.push({ listElement: category, pageBreak: this.checkBreak(row) });
						category = Builder.buildCategory(refCategory);
					}
				});
				if (category.items.length) {
					splittedImageListElements.push({ listElement: category, pageBreak: this.checkBreak(row) });
				}
			} else {
				splittedImageListElements.push({ listElement, pageBreak: this.checkBreak(row) });
			}
		});
		return splittedImageListElements;
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	checkBreak(i: number): boolean {
		return i % 3 === 0;
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

	checkCategoryElement(item: ListElement): boolean {
		return item instanceof Category;
	}

	findTextAreaLines(item: TextAreaSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== ItemType.SELECT.id) {
			return false;
		}
		return (savedItem as SelectSavedItem).value !== Constants.SELECT_ITEM_OPTION_CODE.C;
	}

	checkCategoryBreak(
		elem: ListElement, inspectionTypeCode: string = this.savedInspection.inspectionTypeCode
	): boolean {
		if (inspectionTypeCode === Constants.INSPECTION_TYPE.N) {
			return false;
		}
		const brakeCategory = this.checkCategoryElement(elem) && (elem as Category).code === 'F';
		if (brakeCategory) { return true; }
		return !this.checkCategoryElement(elem) && (elem as SavedItem).item.code === 'C';
	}

	findSheetTop(order: Order = this.order): number {
		let offset = 0;
		if (order.vehicle.type === Constants.VEHICLE_TYPE.CAR) {
			const headerItems = this.findHeaderItems();
			offset = headerItems.length * this.HEADER_ROW_TOP;
		}
		// TODO enum
		return this.BASE_TOP + offset;
	}

	findHeaderItems(
		code: string = this.headerVehicleItem, items: SavedItem[] = this.savedInspection.items
	): SavedItem[] {
		return items.filter(item => item.item.header === code);
	}

}
