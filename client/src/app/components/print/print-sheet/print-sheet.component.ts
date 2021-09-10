import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ListElement } from '../../../objects/list-elements/list-element';
import { ChartOptions, ChartType } from 'chart.js';
import { Color } from 'ng2-charts';
import { Constants } from '../../../objects/constants';
import { Employee } from '../../../objects/employee';
import { PrintService } from '../../../services/print.service';
import { OrderPipe } from '../../../pipes/order.pipe';
import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { EmployeeService } from '../../../services/employee.service';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/orders/centre';
import { Category } from '../../../objects/list-elements/category';
import { Builder } from '../../../objects/builder';
import { Utils } from '../../../objects/utils';
import { SelectSavedItem } from '../../../objects/inspections/saved-items/select-saved-item';
import { TextSavedItem } from '../../../objects/inspections/saved-items/text-saved-item';
import { SelectItem } from '../../../objects/inspections/items/select-item';
import { Item } from '../../../objects/inspections/items/item';
import { TextItem } from '../../../objects/inspections/items/text-item';

@Component({
	selector: 'app-print-sheet',
	templateUrl: './print-sheet.component.html',
	styleUrls: ['./print-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintSheetComponent {

	private readonly ROW_ITEMS = 4;

	listElementsPaginated: ListElement[][];
	listElements: ListElement[];
	imageListElements: { listElement, pageBreak }[];

	constructor(private printService: PrintService, private orderPipe: OrderPipe) {
		const items = this.savedInspection.items.filter(i =>
			i.item.header === undefined
		).filter(i => {
			const selectItem = i.item.type === Constants.ITEM_TYPE.SELECT;
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
		return Constants.ITEM_TYPE.SELECT;
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

	findTextItemUnit(item: SavedItem): string {
		return this.findTextSavedItem(item).text ? (item.item as TextItem).unit || '' : '';
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

	findTextAreaLines(item: TextSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== Constants.ITEM_TYPE.SELECT) {
			return false;
		}
		return (savedItem as SelectSavedItem).value !== Constants.SELECT_ITEM_OPTION_CODE.C;
	}

	checkCategoryBreak(elem: ListElement): boolean {
		const gasCategory = this.checkCategoryElement(elem) && (elem as Category).code === 'G';
		if (gasCategory) { return true; }
		const commentsCategory = !this.checkCategoryElement(elem) && (elem as SavedItem).item.code === 'C';
		return commentsCategory;
	}

}
