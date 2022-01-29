import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef, HostListener, OnDestroy, OnInit, QueryList,
	ViewChild, ViewChildren
} from '@angular/core';
import { InspectionVehicle } from '../../objects/inspections/inspection-vehicle';
import { Constants } from '../../objects/constants';
import { SelectItem } from '../../objects/inspections/items/select-item';
import { SelectItemOption } from '../../objects/inspections/items/select-item-option';
import { Item } from '../../objects/inspections/items/item';
import { InspectionService } from '../../services/inspection.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { LegendComponent } from '../bottom-panel/legend/legend.component';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { TextSavedItemData } from '../../objects/inspections/saved-items/text-saved-item-data';
import { SelectSavedItemData } from '../../objects/inspections/saved-items/select-saved-item-data';
import { Employee } from '../../objects/employee';
import { EmployeeService } from '../../services/employee.service';
import { Order } from '../../objects/orders/order';
import { NavigationEnd, Router } from '@angular/router';
import { MatList } from '@angular/material/list';
import { LoadingService } from '../../services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ResetEmployeeDialogComponent } from '../reset-employee-dialog/reset-employee-dialog.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { ListElement } from '../../objects/list-elements/list-element';
import { Category } from '../../objects/list-elements/category';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { concatMap, debounceTime, filter, take, tap } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { VersionService } from '../../services/version.service';
import { Url } from '../../objects/url';
import { TextItem } from '../../objects/inspections/items/text-item';
import { CameraComponent } from '../bottom-panel/camera/camera.component';
import { SnackBarService } from '../../services/snack-bar.service';
import { TextItemField } from '../../objects/inspections/items/text-item-field';
import { TextAreaSavedItemData } from '../../objects/inspections/saved-items/text-area-saved-item-data';
import { TextSavedItemDataField } from '../../objects/inspections/saved-items/text-saved-item-data-field';
import { ItemType } from '../../objects/inspections/items/item-type';
import { CompressService } from '../../services/compress.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('toolBar') toolBar: ElementRef;
	@ViewChild(MatList, { read: ElementRef }) itemsList: ElementRef;
	@ViewChild('itemsContainer') itemsContainer: ElementRef;
	@ViewChild('clearStorageElem', { read: ElementRef }) clearStorageElem: ElementRef;
	@ViewChild('fillInspection', { read: ElementRef }) fillInspection: ElementRef;
	@ViewChildren('cameraInput') cameraInputs: QueryList<ElementRef>;

	bottomBarHeight: number;
	listElements: ListElement[];
	pressingItem: Item;
	scroll: boolean;
	openedCategories: string[];
	openedMenu: boolean;
	refreshed: boolean;
	landscape: boolean;

	version: string;
	updateVersion: boolean;

	versionInterval: any;

	savingImagesCodes: string[];
	employeeSubscription: Subscription;

	@HostListener(Constants.EVENT.TOUCH_END, ['$event'])
	onTouchEnd(event): void {
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
		private cdRef: ChangeDetectorRef,
		private compressService: CompressService,
		private translateService: TranslateService
	) {
		this.listElements = InspectionService.findGroupedItems(this.inspection.items);
		console.log('List elements', this.listElements);
		this.scroll = false;
		this.openedCategories = [];

		this.version = LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION);
		this.refreshed = false;
		this.savingImagesCodes = [];

		window.addEventListener(Constants.EVENT.DEVICE_MOTION, (event) => this.watchDeviceMotion(event));

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
			() => this.handleVersion(),
			Constants.CHECK_VERSION_INTERVAL
		);
	}

	ngOnInit(): void {
		this.employeeSubscription = InspectionService.employee$.subscribe(() => {
			this.cdRef.detectChanges();
		});
		this.handleVersion();
	}

	ngOnDestroy(): void {
		this.employeeSubscription.unsubscribe();
		clearInterval(this.versionInterval);
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
		this.handleClearStorage(fromEvent(this.clearStorageElem.nativeElement, Constants.EVENT.CLICK));
		this.handleFillInspection(fromEvent(this.fillInspection.nativeElement, Constants.EVENT.CLICK));
	}

	// region Getters / setters

	get inspection(): InspectionVehicle {
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
		return ItemType.SELECT.id;
	}

	get textType(): string {
		return ItemType.TEXT.id;
	}

	get textAreaType(): string {
		return ItemType.TEXT_AREA.id;
	}

	// endregion

	watchDeviceMotion(event: DeviceMotionEvent): void {
		this.landscape = event.accelerationIncludingGravity.y < event.accelerationIncludingGravity.x;
	}

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

	findInspectionTitle(inspection: InspectionVehicle = this.inspection): string {
		return InspectionService.inspectionHandler.findInspectionTitle(inspection) ||
			this.translateService.instant(`inspection.type.${Constants.DETECTED_FAULTS_CODE}`);
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
				this.inspectionService.goBack();
			}
		});
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

	findTextItemField(item: Item): TextItemField {
		return this.findTextItem(item).fields[0];
	}

	checkIndividualTextField(item: TextItem): boolean {
		return item.fields.length === 1;
	}

	findTextItemFieldMaxLength(item: Item): number {
		return this.findTextItemField(item).maxLength || Constants.TEXT_ITEM_MAX_LENGTH;
	}

	findSelectSavedItem(itemCode: string): SelectSavedItemData {
		return InspectionService.findSavedItem(itemCode).findData() as SelectSavedItemData;
	}

	findTextSavedItemData(itemCode: string): TextSavedItemData {
		return InspectionService.findSavedItem(itemCode).findData() as TextSavedItemData;
	}

	findTextAreaSavedItemData(itemCode: string): TextAreaSavedItemData {
		return InspectionService.findSavedItem(itemCode).findData() as TextAreaSavedItemData;
	}

	checkSelectedOption(itemCode: string, optionCode: string): boolean {
		return this.findSelectSavedItem(itemCode).value === optionCode;
	}

	findOptionIndex(itemCode: string, options: SelectItemOption[]): number {
		const selectedValue = this.findSelectSavedItem(itemCode).value;
		return options.findIndex(o => o.code === selectedValue);
	}

	checkLeftOption(itemCode: string, options: SelectItemOption[], i: number): boolean {
		return i < this.findOptionIndex(itemCode, options);
	}

	checkRightOption(itemCode: string, options: SelectItemOption[], i: number): boolean {
		return i > this.findOptionIndex(itemCode, options);
	}

	toggleSelectOption(item: SelectItem): void {
		const selectedIndex = this.findOptionIndex(item.code, item.options);
		const newIndex = InspectionService.inspectionHandler.findSelectOptionIndex(selectedIndex, item.options.length);

		InspectionService.updateSelectItem(item, item.options[newIndex].code).subscribe();
	}

	updateTextFields(item: Item): void {
		const savedItem = this.findTextSavedItemData(item.code);
		InspectionService.updateTextItem(item, savedItem.fields);
	}

	updateText(item: Item): void {
		const savedItem = this.findTextAreaSavedItemData(item.code);
		InspectionService.updateTextAreaItem(item, savedItem.text);
	}

	updateSeparatorValue(item: Item, fields: TextSavedItemDataField[]): void {
		InspectionService.updateTextItem(item, fields);
	}

	openLegend(item: SelectItem): void {
		const bottomSheetRef = this.bottomSheet.open(LegendComponent, { data: item.options });
		bottomSheetRef.afterDismissed().subscribe((option: SelectItemOption) => {
			if (option) {
				InspectionService.updateSelectItem(item, option.code);
				this.cdRef.detectChanges();
			}
		});
	}

	updateGroupedItems(): void {
		this.listElements = InspectionService.findGroupedItems();
	}

	triggerCd(): void {
		this.cdRef.detectChanges();
	}

	setPressingItem(item: Item): void {
		this.pressingItem = item;
	}

	checkScrolledItem(item: Item, pressingItem: Item = this.pressingItem, scroll: boolean = this.scroll): boolean {
		return pressingItem && scroll ? item.code === pressingItem.code : false;
	}

	refresh(): void {
		window.location.reload();
	}

	handleVersion(): void {
		this.versionService.findNewVersion().subscribe(newVersion => {
			if (newVersion) {
				this.updateVersion = true;
				this.openVersionDialog();
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
		LocalStorageService.checkClearStorage(click$).subscribe(() => this.inspectionService.goBack());
	}

	clearStorage(): void {
		this.inspectionService.clearStorage(true);
	}

	checkExistentImage(itemCode: string): boolean {
		return InspectionService.findSavedItem(itemCode).findImage() !== undefined;
	}

	checkShowRestrictiveButton(item: Item): boolean {
		return item.type === ItemType.SELECT.id ?
			InspectionService.findSavedItem(item.code).findValue() === Constants.SELECT_ITEM_OPTION_CODE.SN :
			false;
	}

	checkRestrictiveItem(item: Item): boolean {
		return InspectionService.findSavedItem(item.code).findRestrictive();
	}

	checkSavingImage(itemCode: string, savingImagesCodes: string[] = this.savingImagesCodes): boolean {
		return savingImagesCodes.find(code => code === itemCode) !== undefined;
	}

	checkOpenCamera(itemCode: string): void {
		const savedItem = InspectionService.findSavedItem(itemCode);
		if (savedItem.imageId) {
			const ref = this.bottomSheet.open(
				CameraComponent, { data: { imageId: savedItem.imageId, itemCode } }
			);
			ref.afterDismissed().subscribe((deleted: boolean) => {
				if (deleted) {
					const cameraInput = this.cameraInputs.toArray().find(input => input.nativeElement.id === itemCode);
					cameraInput.nativeElement.value = '';
					this.cdRef.detectChanges();
				}
			});
		}
	}

	addImage(event, itemCode: string, landscape: boolean = this.landscape): void {
		this.savingImagesCodes.push(itemCode);
		const image = event.target.files[0];
		this.compressService.compress(image).pipe(
			take(1),
			concatMap(compressedImage =>
				this.inspectionService.uploadImage(compressedImage, itemCode, landscape)
			)
		).subscribe(() => {
			this.savingImagesCodes = this.savingImagesCodes.filter(code => code !== itemCode);
			this.cdRef.detectChanges();
		});
	}

	handleFillInspection(click$: Observable<any>): void {
		InspectionService.checkFillInspection(click$).subscribe(() =>
			this.cdRef.detectChanges()
		);
	}

	updateRestrictiveItem(item: Item): void {
		const savedItem = InspectionService.findSavedItem(item.code);
		InspectionService.updateRestrictive(savedItem, !savedItem.findRestrictive());
	}

	openVersionDialog(): void {
		const dialogRef = this.dialog.open(
			ConfirmDialogComponent,
			{ data: { message: Constants.MESSAGE_CODE.UPDATE_CLEAR_DATA, allowCancel: false }, autoFocus: false }
		);
		dialogRef.afterClosed().subscribe(() => {
			InspectionService.handleNewVersionData();
			this.refresh();
		});
	}

}
