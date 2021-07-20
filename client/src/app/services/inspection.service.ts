import {Injectable} from '@angular/core';
import {forkJoin, Observable, of, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Url} from '../objects/url';
import {Order} from '../objects/orders/order';
import {Inspection} from '../objects/inspections/inspection';
import {SavedInspection} from '../objects/inspections/saved-inspection';
import * as dayjs from 'dayjs';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';
import {EmployeeService} from './employee.service';
import {catchError, concatMap, finalize, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TextSavedItem} from '../objects/inspections/saved-items/text-saved-item';
import {SelectSavedItem} from '../objects/inspections/saved-items/select-saved-item';
import {Builder} from '../objects/builder';
import {Employee} from '../objects/employee';
import {Centre} from '../objects/orders/centre';
import {Item} from '../objects/inspections/items/item';
import {ListElement} from '../objects/list-elements/list-element';
import {Category} from '../objects/list-elements/category';
import {NameElement} from '../objects/list-elements/name-element';
import {SelectItemOption} from '../objects/inspections/items/select-item-option';
import {SelectItem} from '../objects/inspections/items/select-item';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static order: Order;
	static centre: Centre;
	static inspection: Inspection;
	static selectItemOptions: SelectItemOption[];
	static savedInspection: SavedInspection;
	static lockTimeout: any;

	private static readonly SELECT_ICON_COLOR: { [key: string]: string } = {
		P: '#7b7979',
		C: '#36d23d',
		PS: '#ffb47e',
		SN: '#d23636',
		RA: '#3681d2',
		RR: '#3681d2'
	};

	private static readonly LEVEL_ELEMENTS: ((item: Item) => NameElement)[] = [
		(item: Item) => item.garagePosition,
		(item: Item) => item.vehicleSection ? item.vehicleSection : undefined
	];

	constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

	static setOrder(order: Order): Order {
		this.order = order;
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.ORDER, order);
		return this.order;
	}

	static setCentre(centre: Centre): Centre {
		this.centre = centre;
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.CENTRE, centre);
		return this.centre;
	}

	static initInspection(inspection: any, savedInspection: any): void {
		this.inspection = Builder.buildInspection(inspection);
		this.savedInspection = savedInspection ?
			Builder.loadSavedInspection(savedInspection) :
			Builder.buildSavedInspection(
				inspection, EmployeeService.employee.code, this.order.number, this.order.vehicle.numberPlate
			);
		this.selectItemOptions = this.findSelectItemOptions();
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.INSPECTION, inspection);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, this.savedInspection);
		console.log('Inspection', this.inspection);
		console.log('Saved inspection', this.savedInspection);
		console.log('Select item options', this.selectItemOptions);
	}

	static loadInfo(): void {
		this.inspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION) as Inspection;
		this.order = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ORDER);
		this.centre = LocalStorageService.getItem(Constants.LOCAL_STORAGE.CENTRE);
		this.selectItemOptions = this.findSelectItemOptions();

		EmployeeService.employee = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEE);
		EmployeeService.employees = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEES);

		const savedInspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION);
		this.savedInspection = Builder.loadSavedInspection(savedInspection);

		console.log('Order', this.order);
		console.log('Centre', this.centre);
		console.log('Inspection', this.inspection);
		console.log('Saved inspection', this.savedInspection);
		console.log('Employees', EmployeeService.employees);
		console.log('Selected employee', EmployeeService.employee);
		console.log('Select item options', this.selectItemOptions);
	}

	static checkLocalInspection(orderNumber: number): boolean {
		const localSavedInspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION);
		return localSavedInspection && localSavedInspection.orderNumber === orderNumber;
	}

	static findGroupedItems(
		items: any[] = this.inspection.items,
		i: number = 0,
		levelElements: ((item: any) => NameElement)[] = this.LEVEL_ELEMENTS
	): ListElement[] {
		if (i >= levelElements.length) {
			return items;
		}
		const listElements = [];
		items.forEach(item => {
			const levelElem = levelElements[i](item);
			if (levelElem) {
				const existent: Category = listElements.find(elem =>
					elem instanceof Category && (elem as Category).name === levelElem.name
				);
				if (existent) {
					existent.items.push(item);
				} else {
					listElements.push(new Category(levelElem, [item]));
				}
			} else {
				listElements.push(item);
			}
		});
		i += 1;
		const categoryElements = listElements.filter(item => item instanceof Category);
		categoryElements.forEach(categoryElem => {
			categoryElem.items = this.findGroupedItems(categoryElem.items, i);
		});
		return listElements;
	}

	static findSelectItems(items: Item[] = this.inspection.items): SelectItem[] {
		return items.filter(item => item.type === Constants.ITEM_TYPE.SELECT) as SelectItem[];
	}

	static findSelectItemOptions(): SelectItemOption[] {
		const options = [];
		this.findSelectItems().forEach((item: SelectItem) => {
			item.options.forEach(option => {
				const existent = options.find(o => o.name === option.name);
				if (!existent) {
					options.push(option);
				}
			});
		});
		return options;
	}

	static findIconColor(code: string, selectIconColor: { [key: string]: string } = this.SELECT_ICON_COLOR): string {
		return selectIconColor[code];
	}

	static findMenuItems(menuElements: ListElement[]): Item[] {
		return menuElements.filter(elem => !(elem instanceof Category)) as Item[];
	}

	static findMenuCategories(menuElements: ListElement[]): Category[] {
		return menuElements.filter(elem => elem instanceof Category) as Category[];
	}

	static checkCompleteCategory(category: Category): boolean {
		const items = this.findMenuItems(category.items);
		const completeItems = this.checkCompleteItems(items);
		if (!completeItems) {
			return false;
		}

		const subCategories = this.findMenuCategories(category.items);
		return subCategories.filter(c => this.checkCompleteCategory(c)).length === subCategories.length;
	}

	static checkCompleteItems(items: Item[]): boolean {
		const itemNames = items.map(item => item.name);
		const savedItems = this.savedInspection.items.filter(savedItem =>
			itemNames.find(name => name === savedItem.item.name)
		);
		return !(savedItems.find(savedItem => !savedItem.filled) !== undefined);
	}

	static resetInspection(
		savedInspection: SavedInspection = this.savedInspection, employee: Employee = EmployeeService.employee
	): void {
		savedInspection.items.forEach(item => item.reset(employee.code, item.item));
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static updateSelectItem(
		itemName: string,
		value: string,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		const savedItem = savedInspection.items.find(i => i.item.name === itemName) as SelectSavedItem;
		savedItem.update(value, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static updateTextItem(
		itemName: string,
		text: string,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		const savedItem = savedInspection.items.find(i => i.item.name === itemName) as TextSavedItem;
		savedItem.update(text, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	findInspection(orderCode: string): Observable<any> {
		let errorText;
		return this.findOrderInfo(orderCode).pipe(
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_ORDER;
				return throwError(error);
			}),
			concatMap((orderInfo: any) => {
				const order = InspectionService.setOrder(new Order(orderInfo.order, orderCode));
				console.log('Order', order);
				const centre = InspectionService.setCentre(new Centre(orderInfo.centre));
				console.log('Centre', centre);
				return this.findInspections(order.number);
			}),
			catchError(error => {
				errorText = errorText ? errorText : Constants.MESSAGE.NONEXISTENT_INSPECTIONS;
				return throwError(error);
			}),
			map(inspectionInfo => {
				if (inspectionInfo) {
					console.log('Received inspection info', inspectionInfo);
					InspectionService.initInspection(inspectionInfo.inspection, inspectionInfo.savedInspection);
				}
			}),
			finalize(() => {
				if (errorText) {
					this.snackBar.open(
						errorText, '', {verticalPosition: 'top', duration: Constants.SNACK_BAR.DURATION, panelClass: 'warning-snack-bar'}
					);
				}
			})
		);
	}

	findOrderInfo(shortCode: string): Observable<any> {
		const url = `${Url.orderInfo()}?shortCode=${shortCode}`;
		return this.http.get(url);
	}

	findInspections(orderNumber: number): Observable<any> {
		if (InspectionService.checkLocalInspection(orderNumber)) {
			InspectionService.loadInfo();
			return of(undefined);
		}
		const url = `${Url.inspection()}?orderNumber=${orderNumber}`;
		return this.http.get(url);
	}

	saveInspection(inspection: SavedInspection, employee: Employee = EmployeeService.employee): Observable<any> {
		inspection.employeeCode = employee.code;
		inspection.saved = dayjs();
		console.log('Saving inspection', inspection);
		return this.http.post(Url.inspection(), inspection);
	}

}
