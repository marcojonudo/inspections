import { Injectable } from '@angular/core';
import { from, Observable, of, Subject, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Url } from '../objects/url';
import { Order } from '../objects/orders/order';
import { InspectionVehicle } from '../objects/inspections/inspection-vehicle';
import { SavedInspection } from '../objects/inspections/saved-inspection';
import * as dayjs from 'dayjs';
import { LocalStorageService } from './local-storage.service';
import { Constants } from '../objects/constants';
import { EmployeeService } from './employee.service';
import { catchError, concatMap, debounceTime, filter, finalize, map, tap, buffer } from 'rxjs/operators';
import { SelectSavedItem } from '../objects/inspections/saved-items/select-saved-item';
import { Builder } from '../objects/builder';
import { Employee } from '../objects/employee';
import { Centre } from '../objects/orders/centre';
import { Item } from '../objects/inspections/items/item';
import { ListElement } from '../objects/list-elements/list-element';
import { Category } from '../objects/list-elements/category';
import { NameElement } from '../objects/list-elements/name-element';
import { SelectItemOption } from '../objects/inspections/items/select-item-option';
import { SelectItem } from '../objects/inspections/items/select-item';
import { ItemRelation } from '../objects/inspections/item-relation';
import { SavedItem } from '../objects/inspections/saved-items/saved-item';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from './snack-bar.service';
import { CountryHandler } from '../objects/country-info/country-handler';
import { SpainHandler } from '../objects/country-info/spain-handler';
import { PortugalHandler } from '../objects/country-info/portugal-handler';
import { InspectionHandler } from '../objects/inspection-handler/inspection-handler';
import { OrderInspectionHandler } from '../objects/inspection-handler/order-inspection-handler';
import { DetectedFaultsHandler } from '../objects/inspection-handler/detected-faults-handler';
import { TextSavedItem } from '../objects/inspections/saved-items/text-saved-item';
import { TextSavedItemField } from '../objects/inspections/saved-items/text-saved-item-field';
import { ItemType } from '../objects/inspections/items/item-type';
import { TextAreaSavedItem } from '../objects/inspections/saved-items/text-area-saved-item';
import { Router } from '@angular/router';
import { ResetEmployeeDialogComponent } from '../components/reset-employee-dialog/reset-employee-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VersionService } from './version.service';
import { SaveError } from '../objects/save-error';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	static language: string;
	static countryHandler: CountryHandler;
	static order: Order;
	static centre: Centre;
	static inspection: InspectionVehicle;
	static inspectionHandler: InspectionHandler;
	static selectItemOptions: SelectItemOption[];
	static savedInspection: SavedInspection;
	static lockTimeout: any;

	private static readonly FILL_INSPECTION_CLICK_THRESHOLD: number = 3;

	private static readonly SELECT_ICON_COLOR: { [key: string]: string } = {
		P: '#7b7979',
		C: '#36d23d',
		PS: '#ff6a00',
		SN: '#d23636',
		RA: '#3681d2',
		RR: '#3681d2'
	};

	private static readonly LEVEL_ELEMENTS: ((item: Item) => NameElement)[] = [
		(item: Item) => item.vehicleData.garagePosition,
		(item: Item) => item.vehicleData?.vehicleSection
	];

	private static readonly ITEM_RELATION_ACTION: any = {
		HIDE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, true),
		REPLICATE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(newValue, employeeCode)
	};

	private static readonly ITEM_RELATION_RESTORE_ACTION: any = {
		HIDE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.updateHidden(employeeCode, false),
		REPLICATE: (targetSavedItem: SelectSavedItem, newValue: string, employeeCode: string) =>
			targetSavedItem.update(Constants.SELECT_ITEM_OPTION_CODE.P, employeeCode)
	};

	private static readonly COUNTRY_HANDLER_DECIDER: any = {
		es: new SpainHandler(),
		pt: new PortugalHandler()
	};

	static employeeSubject: Subject<Employee>;
	static employee$: Observable<Employee>;

	constructor(
		private versionService: VersionService,
		private translate: TranslateService,
		private http: HttpClient,
		private snackBarService: SnackBarService,
		private router: Router,
		private dialog: MatDialog
	) {
		InspectionService.employeeSubject = new Subject<Employee>();
		InspectionService.employee$ = InspectionService.employeeSubject.asObservable();
	}

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

	static initInspection(inspection: any): InspectionVehicle {
		this.inspection = Builder.buildInspection(inspection);
		this.inspectionHandler = this.inspection.orderInspection ?
			new OrderInspectionHandler() : new DetectedFaultsHandler();
		this.selectItemOptions = this.findSelectItemOptions();

		LocalStorageService.setItem(Constants.LOCAL_STORAGE.INSPECTION, this.inspection);
		console.log('Inspection', this.inspection);
		console.log('Select item options', this.selectItemOptions);
		return this.inspection;
	}

	static initSavedInspection(savedInspection: any, inspection: InspectionVehicle = this.inspection): void {
		this.savedInspection = savedInspection ?
			Builder.loadSavedInspection(savedInspection, inspection.items, EmployeeService.employee.code) :
			Builder.buildSavedInspection(
				inspection, EmployeeService.employee.code, this.order.number, this.order.vehicle.identifier
			);

		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, this.savedInspection);
		console.log('Saved inspection', this.savedInspection);
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
		return items.filter(item => item.type === ItemType.SELECT.id) as SelectItem[];
	}

	static findSelectItemOptions(): SelectItemOption[] {
		const options = [];
		this.findSelectItems().forEach((item: SelectItem) => {
			item.options.forEach((option: SelectItemOption) => {
				const existent = options.find(o => o.code === option.code);
				if (!existent) {
					options.push(option);
				}
			});
		});
		return options;
	}

	static findSavedItem(code: string, savedInspection = this.savedInspection): SavedItem {
		return savedInspection.items.find(i => i.item.code === code);
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

	static checkCompleteItems(items: Item[], savedInspection: SavedInspection = this.savedInspection): boolean {
		/* Para comprobar si una categoría está completa, se tienen en cuenta sólo aquellos items obligatorios */
		const itemNames = items.filter(item => item.required).map(item => item.name);

		/* Tampoco se tienen en cuenta aquellos items ocultos */
		const savedItems = savedInspection.items.filter(savedItem =>
			!savedItem.hidden && itemNames.find(name => name === savedItem.item.name)
		);
		return !(savedItems.find(savedItem => !savedItem.isFilled()) !== undefined);
	}

	static handleCategoryComplete(category: Category, savedInspection: SavedInspection = this.savedInspection): void {
		this.completeCategory(category);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static completeCategory(category: Category): void {
		const items = this.findMenuItems(category.items);
		this.completeItems(items);

		const subCategories = this.findMenuCategories(category.items);
		if (subCategories.length) {
			subCategories.forEach(subCategory => this.handleCategoryComplete(subCategory));
		}
	}

	static completeItems(
		items: Item[],
		options: SelectItemOption[] = this.selectItemOptions,
		employee: Employee = EmployeeService.employee
	): void {
		const itemNames = items.filter(item => item.type === ItemType.SELECT.id).map(item => item.name);
		const savedItems = this.savedInspection.items.filter(savedItem =>
			itemNames.find(name => name === savedItem.item.name)
		);
		savedItems.forEach(savedItem =>
			(savedItem as SelectSavedItem).update(Constants.SELECT_ITEM_OPTION_CODE.C, employee.code)
		);
	}

	static resetInspection(
		savedInspection: SavedInspection = this.savedInspection, employee: Employee = EmployeeService.employee
	): void {
		savedInspection.items.forEach(item => item.reset(employee.code));
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static updateSelectItem(
		item: Item,
		value: string,
		updateStorage: boolean = true,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): Observable<ItemRelation> {
		const savedItem = savedInspection.items.find(i => i.item.name === item.name);

		/* Antes de actualizar el valor, se debe comprobar si hay alguna relación que deshacer. Por ejemplo, al tener
		 * 'Pastilla de freno' el valor 'No aplica', el espesor está oculto; sin embargo, en cuanto se actualiza el
		 * valor de la primera, el segundo debe volver a aparecer (se está deshaciendo la relación) */
		this.updateRelations(
			savedItem, savedItem.findValue(), item.relations, this.ITEM_RELATION_RESTORE_ACTION
		).subscribe();
		savedItem.update(value, employee.code);

		return this.updateRelations(savedItem, savedItem.findValue(), item.relations, this.ITEM_RELATION_ACTION).pipe(
			finalize(() => {
				if (updateStorage) {
					LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
				}
			})
		);
	}

	static updateRelations(
		savedItem: SavedItem, value: string, relations: ItemRelation[], actions: any
	): Observable<ItemRelation> {
		return from(relations).pipe(
			tap(itemRelation => InspectionService.handleRelation(savedItem, value, itemRelation, actions))
		);
	}

	static handleRelation(
		savedItem: SavedItem,
		value: string,
		itemRelation: ItemRelation,
		actions: any,
		employee: Employee = EmployeeService.employee
	): void {
		if (value === itemRelation.matchText) {
			const targetSavedItem = this.findSavedItem(itemRelation.targetItem.code);
			actions[itemRelation.action](targetSavedItem, savedItem.findValue(), employee.code);
		}
	}

	static updateTextItem(
		item: Item,
		fields: TextSavedItemField[],
		updateStorage: boolean = true,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		const savedItem = savedInspection.items.find(i => i.item.name === item.name) as TextSavedItem;
		savedItem.update(fields, employee.code);
		if (updateStorage) {
			LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
		}
	}

	static updateTextAreaItem(
		item: Item,
		text: string,
		updateStorage: boolean = true,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		const savedItem = savedInspection.items.find(i => i.item.name === item.name) as TextAreaSavedItem;
		savedItem.update(text, employee.code);
		if (updateStorage) {
			LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
		}
	}

	static updateImageId(
		savedItem: SavedItem,
		imageId: number,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		savedItem.addImageId(imageId, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static updateRestrictive(
		savedItem: SavedItem,
		restrictive: boolean,
		savedInspection: SavedInspection = this.savedInspection,
		employee: Employee = EmployeeService.employee
	): void {
		savedItem.updateRestrictive(restrictive, employee.code);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static findImageUrl(image: string): string {
		return `data:image/png;base64,${image}`;
	}

	static checkFillInspection(click$: Observable<any>): Observable<number> {
		return click$.pipe(
			buffer(click$.pipe(debounceTime(300))),
			map(array => array.length),
			filter(length => length === this.FILL_INSPECTION_CLICK_THRESHOLD),
			tap(() => this.fillInspection())
		);
	}

	static fillInspection(savedInspection: SavedInspection = this.savedInspection): void {
		savedInspection.items.forEach(item => {
			const itemType = ItemType.parse(item.item.type);
			itemType.update(item, itemType.findDefaultValue(item));
		});
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION, savedInspection);
	}

	static handleNewVersionData(): void {
		/* Pensado para actualizar objetos del local storage si hay cambios en la nueva versión */
	}

	loadInfo(): boolean {
		let loaded = false;
		try {
			EmployeeService.employee = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEE);
			if (!EmployeeService.employee) {
				const dialogRef = this.dialog.open(ResetEmployeeDialogComponent);
				dialogRef.afterClosed().subscribe(() => {
					InspectionService.savedInspection = Builder.loadSavedInspection(
						LocalStorageService.getItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION),
						InspectionService.inspection.items,
						EmployeeService.employee.code
					);
					InspectionService.employeeSubject.next(EmployeeService.employee);
				});
			}
			EmployeeService.employees = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEES);

			InspectionService.inspection = Builder.buildInspection(
				LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION)
			);
			InspectionService.inspectionHandler = InspectionService.inspection.orderInspection ?
				new OrderInspectionHandler() : new DetectedFaultsHandler();
			InspectionService.savedInspection = Builder.loadSavedInspection(
				LocalStorageService.getItem(Constants.LOCAL_STORAGE.SAVED_INSPECTION),
				InspectionService.inspection.items,
				EmployeeService.employee ? EmployeeService.employee.code : ''
			);

			InspectionService.order = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ORDER);
			InspectionService.centre = LocalStorageService.getItem(Constants.LOCAL_STORAGE.CENTRE);
			InspectionService.selectItemOptions = InspectionService.findSelectItemOptions();

			console.log('Order', InspectionService.order);
			console.log('Centre', InspectionService.centre);
			console.log('Inspection', InspectionService.inspection);
			console.log('Saved inspection', InspectionService.savedInspection);
			console.log('Employees', EmployeeService.employees);
			console.log('Selected employee', EmployeeService.employee);
			console.log('Select item options', InspectionService.selectItemOptions);
			loaded = true;
		} catch (error) {
			console.error('Error loading data', error);
			console.log('Clearing local storage');
			LocalStorageService.clear();
		}
		return loaded;
	}

	clearStorage(goBack: boolean, showSnack: boolean = true): void {
		LocalStorageService.clear();
		if (showSnack) {
			this.snackBarService.open(Constants.MESSAGE_CODE.CLEARED_LOCAL_STORAGE);
		}
		if (goBack) {
			this.goBack();
		}
	}

	goBack(): void {
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.MANUAL_EXIT, true);
		this.router.navigate([Constants.PATH.INIT]);
	}

	findLanguage(): Observable<string> {
		const language = LocalStorageService.getItem(Constants.LOCAL_STORAGE.LANGUAGE);
		return (language ? of(language) : this.http.get(Url.language(), { responseType: 'text' })).pipe(
			catchError(() => of(Constants.DEFAULT_LANGUAGE)),
			tap((lang: string) => {
				InspectionService.language = lang;
				InspectionService.countryHandler = InspectionService.COUNTRY_HANDLER_DECIDER[lang];
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.LANGUAGE, lang);
				console.log('Language', lang);
			})
		);
	}

	initInspectionData(orderCode: string, employee: Employee = EmployeeService.employee): Observable<any> {
		let messageCode = Constants.MESSAGE_CODE.NONEXISTENT_ORDER;
		let order;
		return this.findOrderInfo(orderCode, employee.code).pipe(
			concatMap((orderInfo: any) => {
				order = InspectionService.setOrder(new Order(orderInfo.order));
				console.log('Order', order);
				const centre = InspectionService.setCentre(new Centre(orderInfo.centre));
				console.log('Centre', centre);
				messageCode = Constants.MESSAGE_CODE.NONEXISTENT_INSPECTIONS;
				return this.findInspection(
					order.number,
					Url.inspection(order.number, order.vehicleType),
					Constants.LOCAL_STORAGE.INSPECTION,
					employee.code,
					order.vehicle.identifier
				);
			}),
			concatMap(inspection => {
				console.log('Received inspection', inspection);
				const inspectionVehicle = InspectionService.initInspection(inspection);
				return this.findInspection(
					order.number,
					Url.savedInspection(
						order.number, inspectionVehicle.inspectionType.code, inspectionVehicle.orderInspection
					),
					Constants.LOCAL_STORAGE.SAVED_INSPECTION,
					employee.code
				);
			}),
			concatMap(savedInspection => {
				console.log('Received saved inspection', savedInspection);
				InspectionService.initSavedInspection(savedInspection);
				return of(true);
			}),
			catchError(error => {
				this.snackBarService.open(messageCode, Constants.SNACK_BAR.TYPE.WARNING);
				return throwError(error);
			})
		);
	}

	findOrderInfo(shortCode: string, employeeCode: string): Observable<any> {
		const url = `${Url.orderInfo()}?shortCode=${shortCode}`;
		return this.http.get(url, { headers: { employeeCode } });
	}

	findInspection(
		orderNumber: number, url: string, localStorageKey: string, employeeCode: string, numberPlate: string = ''
	): Observable<any> {
		const loaded = InspectionService.checkLocalInspection(orderNumber);
		if (loaded) {
			const existentInspection = LocalStorageService.getItem(localStorageKey);
			return of(existentInspection);
		} else {
			return this.http.get(url, { headers: { employeeCode, numberPlate } });
		}
	}

	uploadImage(
		file: File, itemCode: string, landscape: boolean, order: Order = InspectionService.order
	): Observable<any> {
		const formData = new FormData();
		formData.append('image', file);

		const url = `${Url.images()}?orderNumber=${order.number}&itemCode=${itemCode}&landscape=${landscape}`;
		return this.http.post(url, formData).pipe(
			tap((savedImage: any) => {
				const savedItem = InspectionService.findSavedItem(itemCode);
				InspectionService.updateImageId(savedItem, savedImage.id);
			}),
			catchError(() => {
				this.snackBarService.open(
					Constants.MESSAGE_CODE.ERROR_SAVING_IMAGE, Constants.SNACK_BAR.TYPE.WARNING
				);
				return of(true);
			}),
		);
	}

	removeImage(imageId: number, itemCode: string): void {
		const savedItem = InspectionService.findSavedItem(itemCode);
		InspectionService.updateImageId(savedItem, undefined);
	}

	saveInspection(
		savedInspection: SavedInspection,
		inspection: InspectionVehicle = InspectionService.inspection,
		employee: Employee = EmployeeService.employee,
		centre: Centre = InspectionService.centre
	): Observable<any> {
		const body = InspectionService.inspectionHandler.findSavedInspection(savedInspection, inspection.items);
		body.employeeCode = employee.code;
		body.saved = dayjs();
		console.log('Saving inspection', body);
		return this.http.post(Url.inspection(), body, { headers: { centre: `${centre.code}` } }).pipe(
			tap(
				() => {},
				(error) => {
					const saveError = new SaveError(savedInspection, error.status, error.message);
					this.http.post(Url.saveErrors(), saveError, { headers: { centre: `${centre.code}` } }).subscribe();
				}
			)
		);
	}

	handleUpdatedVersion(): Observable<string> {
		return this.versionService.findNewVersion().pipe(
			tap(newVersion => {
				if (newVersion) {
					this.clearStorage(false, false);
				}
			})
		);
	}

}
