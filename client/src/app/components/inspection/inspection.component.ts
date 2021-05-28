import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef,
	ViewChild
} from '@angular/core';
import {Inspection} from '../../objects/inspections/inspection';
import {Constants} from '../../objects/constants';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Item} from '../../objects/inspections/items/item';
import {TextItem} from '../../objects/inspections/items/text-item';
import {InspectionService} from '../../services/inspection.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {LegendComponent} from '../bottom-panel/legend/legend.component';
import {SavedInspection} from '../../objects/inspections/saved-inspection';
import {TextSavedItem} from '../../objects/inspections/saved-items/text-saved-item';
import {SelectSavedItem} from '../../objects/inspections/saved-items/select-saved-item';
import {Employee} from '../../objects/employee';
import {EmployeeService} from '../../services/employee.service';
import {Order} from '../../objects/orders/order';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent implements AfterViewInit {

	@ViewChild('toolBar') toolBar: ElementRef;

	bottomBarHeight: number;
	groupedItems: { [key: string]: Item[] };
	saving: boolean;

	constructor(
		private inspectionService: InspectionService,
		private bottomSheet: MatBottomSheet,
		private router: Router,
		private cdRef: ChangeDetectorRef
	) {
		this.groupedItems = this.findGroupedItems();
	}

	ngAfterViewInit(): void {
		this.bottomBarHeight = this.toolBar.nativeElement.getBoundingClientRect().height;
		this.cdRef.detectChanges();
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

	findGroupedItems(inspection: Inspection = this.inspection): { [key: string]: Item[] } {
		const groupedItems = {};
		inspection.items.forEach(item => {
			if (groupedItems[item.garagePosition.name]) {
				groupedItems[item.garagePosition.name].push(item);
			} else {
				groupedItems[item.garagePosition.name] = [];
			}
		});
		return groupedItems;
	}

	goBack(): void {
		this.router.navigate([Constants.PATH.INIT]);
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
		item.options[selectedIndex].selected = false;
		item.options[newIndex].selected = true;

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
		).subscribe();
	}

	updateGroupedItems(): void {
		this.groupedItems = this.findGroupedItems();
	}

}
