import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef, HostListener,
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
import {debounceTime, finalize, tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SnackBarService} from '../../services/snack-bar.service';
import {MatList} from '@angular/material/list';
import {fromEvent} from 'rxjs';
import {MatAccordion} from '@angular/material/expansion';
import {LoadingService} from '../../services/loading.service';
import {MatDialog} from '@angular/material/dialog';
import {ResetEmployeeDialogComponent} from '../reset-employee-dialog/reset-employee-dialog.component';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent implements AfterViewInit {

	@ViewChild('toolBar') toolBar: ElementRef;
	@ViewChild(MatList, { read: ElementRef }) itemsList: ElementRef;
	@ViewChild(MatAccordion) accordion: MatAccordion;
	@ViewChild(MatAccordion, { read: ElementRef }) accordionElementRef: ElementRef;

	bottomBarHeight: number;
	groupedItems: { [key: string]: Item[] };
	saving: boolean;
	pressingItem: Item;
	scroll: boolean;
	openedCategories: string[];
	lockTimeout: any;

	private readonly SELECT_ICON_COLOR: { [key: string]: string } = {
		C: '#36d23d',
		PS: '#ffb47e',
		SN: '#d23636',
		RA: '#3681d2',
		RR: '#3681d2'
	};

	@HostListener(Constants.EVENT.TOUCH_START) onTouchStart(): void {
		this.setResetEmployeeTimeout();
	}

	constructor(
		private inspectionService: InspectionService,
		private bottomSheet: MatBottomSheet,
		private loadingService: LoadingService,
		private snackBarService: SnackBarService,
		private dialog: MatDialog,
		private router: Router,
		private cdRef: ChangeDetectorRef
	) {
		this.groupedItems = this.findGroupedItems();
		this.scroll = false;
		this.openedCategories = [];
		const resetEmployee = LocalStorageService.getItem(Constants.LOCAL_STORAGE.RESET_EMPLOYEE);
		if (resetEmployee) {
			this.handleEmployeeDialog();
		} else {
			this.setResetEmployeeTimeout();
		}
	}

	ngAfterViewInit(): void {
		fromEvent(this.accordionElementRef.nativeElement, Constants.EVENT.SCROLL).pipe(
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

	// endregion

	setResetEmployeeTimeout(): void {
		clearTimeout(this.lockTimeout);
		this.lockTimeout = setTimeout(
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

	findGroupedItems(inspection: Inspection = this.inspection): { [key: string]: Item[] } {
		const groupedItems = {};
		inspection.items.forEach(item => {
			if (groupedItems[item.garagePosition.name]) {
				groupedItems[item.garagePosition.name].push(item);
			} else {
				groupedItems[item.garagePosition.name] = [item];
			}
		});
		return groupedItems;
	}

	findIconColor(code: string, selectIconColor: { [key: string]: string } = this.SELECT_ICON_COLOR): string {
		return selectIconColor[code];
	}

	goBack(): void {
		this.router.navigate([Constants.PATH.INIT]);
	}

	expandAll(accordion: MatAccordion = this.accordion): void {
		const openedItem = this.checkOpenedCategory();
		if (openedItem) {
			accordion.closeAll();
		} else {
			accordion.openAll();
		}
	}

	addOpenedCategory(name: string, openedCategories: string[] = this.openedCategories): void {
		openedCategories.push(name);
	}

	removeOpenedCategory(name: string, openedCategories: string[] = this.openedCategories): void {
		const index = openedCategories.indexOf(name);
		openedCategories.splice(index, 1);
	}

	checkOpenedCategory(openedCategories: string[] = this.openedCategories): boolean {
		return openedCategories.length > 0;
	}

	findSaveButtonBottom(): string {
		return `calc(${this.bottomBarHeight}px + 1rem)`;
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectItem(item: Item): SelectItem {
		return item as SelectItem;
	}

	findSelectSavedItem(itemName: string, savedInspection: SavedInspection = this.savedInspection): SelectSavedItem {
		return savedInspection.items.find(savedItem => savedItem.item.name === itemName) as SelectSavedItem;
	}

	findTextSavedItem(itemName: string, savedInspection: SavedInspection = this.savedInspection): TextSavedItem {
		return savedInspection.items.find(savedItem => savedItem.item.name === itemName) as TextSavedItem;
	}

	checkSelectedOption(itemName: string, optionName: string): boolean {
		return this.findSelectSavedItem(itemName).value === optionName;
	}

	findOptionIndex(itemName: string, options: SelectItemOption[]): number {
		const selectedValue = this.findSelectSavedItem(itemName).value;
		return options.findIndex(o => o.name === selectedValue);
	}

	checkLeftOption(itemName: string, options: SelectItemOption[], i: number): boolean {
		return i < this.findOptionIndex(itemName, options);
	}

	checkRightOption(itemName: string, options: SelectItemOption[], i: number): boolean {
		return i > this.findOptionIndex(itemName, options);
	}

	toggleSelectOption(item: SelectItem): void {
		const selectedIndex = this.findOptionIndex(item.name, item.options);
		const newIndex = (selectedIndex + 1) % item.options.length;

		InspectionService.updateSelectItem(item.name, item.options[newIndex].name);
	}

	updateText(itemName: string): void {
		const text = this.findTextSavedItem(itemName).text;
		InspectionService.updateTextItem(itemName, text);
	}

	openLegend(options: SelectItemOption[]): void {
		this.bottomSheet.open(LegendComponent, {data: options});
	}

	saveInspection(
		savedInspection: SavedInspection = this.savedInspection, orderNumber: number = this.order.number
	): void {
		this.saving = true;
		this.inspectionService.saveInspection(savedInspection, orderNumber).pipe(
			finalize(() => {
				this.saving = false;
				this.cdRef.detectChanges();
			})
		).subscribe(
			() => this.snackBarService.open(Constants.MESSAGE.SAVED_INSPECTION),
			() => this.snackBarService.open(Constants.MESSAGE.ERROR_SAVING_INSPECTION, Constants.SNACK_BAR.TYPE.ERROR)
		);
	}

	updateGroupedItems(): void {
		this.groupedItems = this.findGroupedItems();
	}

	setPressingItem(item: Item): void {
		this.pressingItem = item;
	}

	checkScrolledItem(item: Item, pressingItem: Item = this.pressingItem, scroll: boolean = this.scroll): boolean {
		return pressingItem && scroll ? item.name === pressingItem.name : false;
	}

}
