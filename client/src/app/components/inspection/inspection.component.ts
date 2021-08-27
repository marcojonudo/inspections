import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef, HostListener, OnInit,
	ViewChild
} from '@angular/core';
import {Inspection} from '../../objects/inspections/inspection';
import {Constants} from '../../objects/constants';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Item} from '../../objects/inspections/items/item';
import {InspectionService} from '../../services/inspection.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {LegendComponent} from '../bottom-panel/legend/legend.component';
import {SavedInspection} from '../../objects/inspections/saved-inspection';
import {TextSavedItem} from '../../objects/inspections/saved-items/text-saved-item';
import {SelectSavedItem} from '../../objects/inspections/saved-items/select-saved-item';
import {Employee} from '../../objects/employee';
import {EmployeeService} from '../../services/employee.service';
import {Order} from '../../objects/orders/order';
import {NavigationEnd, Router} from '@angular/router';
import {MatList} from '@angular/material/list';
import {LoadingService} from '../../services/loading.service';
import {MatDialog} from '@angular/material/dialog';
import {ResetEmployeeDialogComponent} from '../reset-employee-dialog/reset-employee-dialog.component';
import {LocalStorageService} from '../../services/local-storage.service';
import {ListElement} from '../../objects/list-elements/list-element';
import {Category} from '../../objects/list-elements/category';
import {fromEvent, Observable} from 'rxjs';
import {debounceTime, filter, tap} from 'rxjs/operators';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {VersionService} from '../../services/version.service';
import {Url} from '../../objects/url';
import {TextItem} from '../../objects/inspections/items/text-item';
import {SnackBarService} from '../../services/snack-bar.service';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent implements OnInit, AfterViewInit {

	@ViewChild('toolBar') toolBar: ElementRef;
	@ViewChild(MatList, { read: ElementRef }) itemsList: ElementRef;
	@ViewChild('itemsContainer') itemsContainer: ElementRef;
	@ViewChild('clearStorage', { read: ElementRef }) clearStorage: ElementRef;

	bottomBarHeight: number;
	listElements: ListElement[];
	pressingItem: Item;
	scroll: boolean;
	openedCategories: string[];
	openedMenu: boolean;
	refreshed: boolean;

	version: string;
	updateVersion: boolean;

	versionInterval: any;

	@HostListener(Constants.EVENT.TOUCH_START, ['$event'])
	onTouchStart(event): void {
		this.setResetEmployeeTimeout();
		this.checkCurrentUrl();
		this.checkCloseMenu(event.target.className);
	}

	constructor(
		private inspectionService: InspectionService,
		private bottomSheet: MatBottomSheet,
		private loadingService: LoadingService,
		private versionService: VersionService,
		private dialog: MatDialog,
		private snackBarService: SnackBarService,
		private router: Router,
		private cdRef: ChangeDetectorRef
	) {
		this.listElements = InspectionService.findGroupedItems(this.inspection.items);
		console.log('List elements', this.listElements);
		this.scroll = false;
		this.openedCategories = [];

		this.version = LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION);
		this.refreshed = false;

		const resetEmployee = LocalStorageService.getItem(Constants.LOCAL_STORAGE.RESET_EMPLOYEE);
		if (resetEmployee) {
			this.handleEmployeeDialog();
		} else {
			this.setResetEmployeeTimeout();
		}

		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: NavigationEnd) => {
			this.refreshed = event.id === 1;
		});

		this.versionInterval = setInterval(
			() => this.handleVersion(true),
			Constants.CHECK_VERSION_INTERVAL
		);
	}

	ngOnInit(): void {
		this.handleVersion(false);
	}

	ngAfterViewInit(): void {
		fromEvent(this.itemsContainer.nativeElement, Constants.EVENT.SCROLL).pipe(
			tap(() => {
				this.scroll = true;
				this.cdRef.detectChanges();
			}),
			debounceTime(500)
		).subscribe(() => {
			this.scroll = false;
			this.cdRef.detectChanges();
		});
		this.bottomBarHeight = this.toolBar.nativeElement.getBoundingClientRect().height;
		this.loadingService.stop();
		this.handleClearStorage(fromEvent(this.clearStorage.nativeElement, Constants.EVENT.CLICK));
	}

	// region Getters / setters

	get inspection(): Inspection {
		return InspectionService.inspection;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.savedInspection;
	}

	get employee(): Employee {
		return EmployeeService.employee;
	}

	get order(): Order {
		return InspectionService.order;
	}

	get selectType(): string {
		return Constants.ITEM_TYPE.SELECT;
	}

	get textType(): string {
		return Constants.ITEM_TYPE.TEXT;
	}

	get textAreaType(): string {
		return Constants.ITEM_TYPE.TEXT_AREA;
	}

	// endregion

	setResetEmployeeTimeout(): void {
		clearTimeout(InspectionService.lockTimeout);
		InspectionService.lockTimeout = setTimeout(
			() => this.handleEmployeeDialog(),
			Constants.RESET_EMPLOYEE_INTERVAL * 1000
		);
	}

	handleEmployeeDialog(): void {
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.RESET_EMPLOYEE, true);
		const dialogRef = this.dialog.open(ResetEmployeeDialogComponent);
		dialogRef.afterClosed().subscribe(() => {
			LocalStorageService.setItem(Constants.LOCAL_STORAGE.RESET_EMPLOYEE, false);
			this.setResetEmployeeTimeout();
			this.cdRef.detectChanges();
		});
	}

	checkCurrentUrl(): void {
		/* Si al hacer tap se está en la URL de print, significa que se acaba de imprimir. En ese caso, se retorna a la
		 * URL de la pantalla principal */
		if (this.router.url.includes('print')) {
			this.router.navigate([Constants.PATH.INSPECTION]);
		}
	}

	checkCloseMenu(targetClasses: string): void {
		/* Se actualiza la variable si se hace clic fuera del botón de menú. En caso contrario, ya se gestiona su
		 * apertura y cierre desde el evento del propio botón */
		if (!targetClasses.includes(Constants.MENU_TOGGLE)) {
			this.openedMenu = this.openedMenu === undefined ? false : undefined;
		}
	}

	findMenuCategories(menuElements: ListElement[]): Category[] {
		return InspectionService.findMenuCategories(menuElements);
	}

	checkMenuItems(menuElements: ListElement[]): boolean {
		return InspectionService.findMenuItems(menuElements).length > 0;
	}

	findMenuItems(menuElements: ListElement[]): Item[] {
		return InspectionService.findMenuItems(menuElements);
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	checkCompleteCategory(category: Category): boolean {
		return InspectionService.checkCompleteCategory(category);
	}

	checkGoBack(): void {
		const dialogRef = this.dialog.open(
			ConfirmDialogComponent, { data: { message: Constants.MESSAGE_CODE.WARNING_GOING_BACK }, autoFocus: false }
		);
		dialogRef.afterClosed().subscribe((confirm: boolean) => {
			if (confirm) {
				this.goBack();
			}
		});
	}

	goBack(): void {
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.MANUAL_EXIT, true);
		this.router.navigate([Constants.PATH.INIT]);
	}

	addOpenedCategory(name: string, openedCategories: string[] = this.openedCategories): void {
		openedCategories.push(name);
	}

	removeOpenedCategory(name: string, openedCategories: string[] = this.openedCategories): void {
		const index = openedCategories.indexOf(name);
		openedCategories.splice(index, 1);
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectItem(item: Item): SelectItem {
		return item as SelectItem;
	}

	findTextItem(item: Item): TextItem {
		return item as TextItem;
	}

	findSelectSavedItem(itemName: string, savedInspection: SavedInspection = this.savedInspection): SelectSavedItem {
		return savedInspection.items.find(savedItem => savedItem.item.name === itemName) as SelectSavedItem;
	}

	findTextSavedItem(itemName: string, savedInspection: SavedInspection = this.savedInspection): TextSavedItem {
		return savedInspection.items.find(savedItem => savedItem.item.name === itemName) as TextSavedItem;
	}

	checkSelectedOption(itemName: string, optionCode: string): boolean {
		return this.findSelectSavedItem(itemName).value === optionCode;
	}

	findOptionIndex(itemName: string, options: SelectItemOption[]): number {
		const selectedValue = this.findSelectSavedItem(itemName).value;
		return options.findIndex(o => o.code === selectedValue);
	}

	checkLeftOption(itemName: string, options: SelectItemOption[], i: number): boolean {
		return i < this.findOptionIndex(itemName, options);
	}

	checkRightOption(itemName: string, options: SelectItemOption[], i: number): boolean {
		return i > this.findOptionIndex(itemName, options);
	}

	toggleSelectOption(item: SelectItem): void {
		const selectedIndex = this.findOptionIndex(item.name, item.options);
		/* Con el segundo sumando, se evita que la opción por defecto ('Pendiente') sea seleccionada de nuevo */
		const newIndex = (selectedIndex + 1) % item.options.length + Math.floor(selectedIndex / (item.options.length - 1));

		InspectionService.updateItem(item, item.options[newIndex].code).subscribe();
	}

	updateText(item: Item): void {
		const text = this.findTextSavedItem(item.name).text;
		InspectionService.updateItem(item, text).subscribe();
	}

	openLegend(item: SelectItem): void {
		const bottomSheetRef = this.bottomSheet.open(LegendComponent, { data: item.options });
		bottomSheetRef.afterDismissed().subscribe((option: SelectItemOption) => {
			if (option) {
				InspectionService.updateItem(item, option.code);
				this.cdRef.detectChanges();
			}
		});
	}

	updateGroupedItems(): void {
		this.listElements = InspectionService.findGroupedItems();
	}

	setPressingItem(item: Item): void {
		this.pressingItem = item;
	}

	checkScrolledItem(item: Item, pressingItem: Item = this.pressingItem, scroll: boolean = this.scroll): boolean {
		return pressingItem && scroll ? item.name === pressingItem.name : false;
	}

	refresh(): void {
		window.location.reload();
	}

	handleVersion(scheduled: boolean): void {
		this.versionService.handleVersion(scheduled, this.refreshed).subscribe(showUpdateIndicator => {
			if (showUpdateIndicator) {
				this.updateVersion = showUpdateIndicator;
				this.cdRef.detectChanges();
			} else {
				this.version = LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION);
			}
		});
	}

	openChangelog(): void {
		window.open(Url.changelog(), '_self');
	}

	completeCategory(event: Event, category: Category): void {
		event.stopPropagation();
		InspectionService.handleCategoryComplete(category);
	}

	handleClearStorage(click$: Observable<any>): void {
		LocalStorageService.checkClearStorage(click$).subscribe(() => {
			this.snackBarService.open(Constants.MESSAGE_CODE.CLEARED_LOCAL_STORAGE);
			this.goBack();
		});
	}

	// fill(): void {
	// 	InspectionService.savedInspection.items.filter(i => i.item.type === 'TEXT').forEach((i: TextSavedItem) => {
	// 		i.text = '12';
	// 	});
	// }

}
