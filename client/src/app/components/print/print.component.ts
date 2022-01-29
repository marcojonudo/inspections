import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component
} from '@angular/core';
import { PrintService } from '../../services/print.service';
import { InspectionService } from '../../services/inspection.service';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { Constants } from '../../objects/constants';
import { Centre } from '../../objects/orders/centre';
import { Order } from '../../objects/orders/order';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';
import { ItemType } from '../../objects/inspections/items/item-type';
import { CategoryItems } from '../../objects/print/category-items';
import { Url } from '../../objects/url';
import { CustomImage } from '../../objects/inspections/custom-image';
import { HttpClient } from '@angular/common/http';
import { VehicleType } from '../../objects/orders/vehicles/vehicle-type';

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent {

	private readonly IMAGES_ROW_ITEMS = 3;
	private readonly CAR_TYRES = ['DI', 'DD', 'TI', 'TD'];

	adviser: Employee;
	mechanics: Employee[];
	vehicleType: VehicleType;
	tyreGroupedItems: { [key: string]: SavedItem[] };
	showTyreSheet: boolean;
	visualControlSavedItem: SavedItem;
	pressureSavedItem: SavedItem;
	measurementSavedItem: SavedItem;
	groupedCategories: CategoryItems[][];
	groupedImageCategories: CategoryItems[][];
	images: CustomImage[];

	constructor(
		private printService: PrintService, private http: HttpClient, private cdRef: ChangeDetectorRef
	) {
		this.images = [];
		this.adviser = EmployeeService.findEmployee(this.order.sellerCode);
		this.mechanics = InspectionService.inspectionHandler.findSavedItems(this.savedInspection)
			.map(i => i.findEmployeeCode())
			.filter((value, index, self) => value && self.indexOf(value) === index)
			.map(employeeCode => EmployeeService.findEmployee(employeeCode));

		this.vehicleType = VehicleType.parse(this.savedInspection.vehicle);

		const savedItems = InspectionService.inspectionHandler.findSavedItems(this.savedInspection)
			.filter(i => i.item.header === undefined && i.item.print);
		this.tyreGroupedItems = this.findTyreItems(savedItems);
		const depthCodes = this.CAR_TYRES.map(carTyre => `${Constants.DEPTH_ITEM_CODE}${carTyre}`);
		const depthItems = savedItems.filter(i => depthCodes.find(c => c === i.item.code) !== undefined);
		this.showTyreSheet = depthItems.find(i => i.imageId) !== undefined;
		this.visualControlSavedItem = savedItems.find(i => i.item.code === 'CVGN');
		this.pressureSavedItem = savedItems.find(i => i.item.code === 'PPN');
		this.measurementSavedItem = savedItems.find(i => i.item.code === 'PN');

		const existentSavedItems = savedItems.filter(i => {
			const selectItem = i.type === ItemType.SELECT.id;
			return !i.hidden && (selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true);
		});
		const categories = this.buildPrintCategories(existentSavedItems);
		this.groupedCategories = this.buildGroupedCategories(categories);

		const imageSavedItems = InspectionService.inspectionHandler.findSavedItems(this.savedInspection)
			.filter(savedItem => savedItem.imageId);
		if (imageSavedItems.length) {
			const imageIds = imageSavedItems.map(savedItem => savedItem.imageId);
			this.http.get(Url.images(), { params: { ids: `${imageIds.join(',')}` } }).subscribe((images: CustomImage[]) => {
				this.images = images;
				const noTyreImages = imageSavedItems.filter(i => depthCodes.find(c => c === i.item.code) === undefined);
				if (noTyreImages.length) {
					const imageCategories = this.buildPrintCategories(noTyreImages);
					this.groupedImageCategories = this.buildGroupedImageCategories(imageCategories);
				}
				this.cdRef.detectChanges();
				this.printService.openPrintDialog();
			});
		} else {
			this.printService.openPrintDialog();
		}
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

	// endregion

	findTyreItems(savedItems: SavedItem[]): { [key: string]: SavedItem[] } {
		const tyreSavedItems = {};
		this.CAR_TYRES.forEach(carTyre => {
			tyreSavedItems[carTyre] = [];
			Constants.TYRE_ITEM_CODES.forEach(tyreCode => {
				const savedItem = savedItems.find(s => s.item.code === `${tyreCode}${carTyre}`);
				/* Si un neumático tiene valor 'No aplica', no se encontrará saved item */
				if (savedItem) {
					tyreSavedItems[carTyre].push(savedItem);
				}
			});
		});
		return tyreSavedItems;
	}

	buildPrintCategories(savedItems: SavedItem[]): CategoryItems[] {
		const categories = [];
		savedItems.forEach(savedItem => {
			if (savedItem.item.category) {
				const existent: CategoryItems = categories.find(cat =>
					cat.category && cat.category.code === savedItem.item.category.code
				);
				if (existent) {
					existent.addItem(savedItem);
				} else {
					categories.push(new CategoryItems([savedItem], savedItem.item.category));
				}
			} else {
				categories.push(new CategoryItems([savedItem]));
			}
		});
		return categories;
	}

	sortCategories(categories: CategoryItems[]): CategoryItems[] {
		return categories.sort((a, b) => {
			if (!a.category) { return 1; }
			if (!b.category) { return -1; }
			else {
				return a.category.order < b.category.order ? -1 : 1;
			}
		});
	}

	buildGroupedCategories(categories: CategoryItems[]): CategoryItems[][] {
		const sortedCategories = this.sortCategories(categories);
		const i = sortedCategories.findIndex(cat => cat.category?.code === 'F');
		return i !== -1 ?
			[sortedCategories.slice(0, i + 1), sortedCategories.slice(i + 1, sortedCategories.length)] :
			[sortedCategories];
	}

	buildGroupedImageCategories(categories: CategoryItems[]): CategoryItems[][] {
		const groupedCategories = [[]];
		const sortedCategories = this.sortCategories(categories);
		sortedCategories.forEach(category => {
			const rows = groupedCategories[groupedCategories.length - 1]
				.map(cat => Math.ceil(cat.items.length / Constants.ROW_IMAGES))
				.reduce((a, b) => a + b, 0);
			const newRows = rows + category.imagesRows.length;
			const pageRows = rows < this.IMAGES_ROW_ITEMS ?
				(newRows - this.IMAGES_ROW_ITEMS > 0 ? newRows - this.IMAGES_ROW_ITEMS : newRows)
				: 0;
			const newPageRows = category.imagesRows.length - pageRows;
			if (newPageRows > 0) {
				if (pageRows > 0) {
					const samePageItems = [].concat(...category.imagesRows.slice(0, pageRows));
					const samePageCategoryItems = category.clone(samePageItems);
					const newPageItems = [].concat(...category.imagesRows.slice(pageRows + 1, category.imagesRows.length));
					const newPageCategoryItems = category.clone(newPageItems);

					groupedCategories[groupedCategories.length - 1].push(samePageCategoryItems);
					groupedCategories.push([newPageCategoryItems]);
				} else {
					groupedCategories.push([category]);
				}
			} else {
				groupedCategories[groupedCategories.length - 1].push(category);
			}
		});
		return groupedCategories;
	}

}
