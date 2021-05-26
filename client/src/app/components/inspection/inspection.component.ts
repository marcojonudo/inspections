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
	savedInspection: SavedInspection;
	savedItemBuilder: any;
	saving: boolean;

	constructor(
		private inspectionService: InspectionService,
		private bottomSheet: MatBottomSheet,
		private cdRef: ChangeDetectorRef
	) {
		this.savedItemBuilder = {
			TEXT: (item: TextItem, employeeCode: string) => new TextSavedItem(item, employeeCode),
			SELECT: (item: SelectItem, employeeCode: string) => new SelectSavedItem(item, employeeCode)
		};
		this.groupedItems = this.findGroupedItems();
		const savedItems = this.inspection.items.map(item => this.savedItemBuilder[item.type](item, this.employee.code));
		this.savedInspection = new SavedInspection(this.inspection.name, this.order.number, savedItems);
	}

	ngAfterViewInit(): void {
		this.bottomBarHeight = this.toolBar.nativeElement.getBoundingClientRect().height;
		this.cdRef.detectChanges();
	}

	get inspection(): Inspection {
		return InspectionService.inspection;
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

	findSaveButtonBottom(): string {
		return `calc(${this.bottomBarHeight}px + 1rem)`;
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

	checkLeftOption(options: SelectItemOption[], i: number): boolean {
		return i < options.findIndex(o => o.selected);
	}

	checkRightOption(options: SelectItemOption[], i: number): boolean {
		return i > options.findIndex(o => o.selected);
	}

	toggleSelectOption(item: SelectItem): void {
		const selectedIndex = item.options.findIndex(o => o.selected);
		item.options[selectedIndex].selected = false;
		item.options[(selectedIndex + 1) % item.options.length].selected = true;

		const savedItem = this.savedInspection.items.find(i => i.item.name === item.name) as SelectSavedItem;
		savedItem.update(item.options[(selectedIndex + 1) % item.options.length].name);
	}

	updateText(item: TextItem, text: string): void {
		const savedItem = this.savedInspection.items.find(i => i.item.name === item.name) as TextSavedItem;
		savedItem.update(text);
	}

	openLegend(options: SelectItemOption[]): void {
		this.bottomSheet.open(LegendComponent, {data: options});
	}

	saveInspection(inspection: SavedInspection = this.savedInspection): void {
		this.saving = true;
		this.inspectionService.saveInspection(inspection).pipe(
			finalize(() => {
				this.saving = false;
			})
		).subscribe();
	}

	updateGroupedItems(): void {
		this.groupedItems = this.findGroupedItems();
	}

}
