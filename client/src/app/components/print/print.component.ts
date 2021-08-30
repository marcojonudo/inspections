import {
	ChangeDetectionStrategy,
	Component,
	OnInit
} from '@angular/core';
import {PrintService} from '../../services/print.service';
import {InspectionService} from '../../services/inspection.service';
import {SavedInspection} from '../../objects/inspections/saved-inspection';
import {Constants} from '../../objects/constants';
import {SelectSavedItem} from '../../objects/inspections/saved-items/select-saved-item';
import {Centre} from '../../objects/orders/centre';
import {Order} from '../../objects/orders/order';
import {SavedItem} from '../../objects/inspections/saved-items/saved-item';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {TextSavedItem} from '../../objects/inspections/saved-items/text-saved-item';
import {Category} from '../../objects/list-elements/category';
import {ChartOptions, ChartType} from 'chart.js';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Color} from 'ng2-charts';
import {OrderPipe} from '../../pipes/order.pipe';
import {ListElement} from '../../objects/list-elements/list-element';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit {

	private readonly GROUP_LABELS: { [key: string]: string[] };

	listElements: Category[];

	chartType: ChartType;
	options: ChartOptions;
	colors: Color[];
	avoidLegendItems: string[] = [Constants.SELECT_ITEM_OPTION_CODE.NA];
	seller: Employee;

	constructor(private printService: PrintService, private orderPipe: OrderPipe) {
		this.GROUP_LABELS = {
			'Realizado ajuste/cambio/relleno': [
				Constants.SELECT_ITEM_OPTION_CODE.RA, Constants.SELECT_ITEM_OPTION_CODE.RR
			]
		};
		const items = this.savedInspection.items.filter(i =>
			i.item.header === undefined
		).filter(i => {
			const selectItem = i.item.type === Constants.ITEM_TYPE.SELECT;
			return selectItem ? i.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.NA : true;
		});
		this.listElements = InspectionService.findGroupedItems(
			items, 0, [(savedItem: SavedItem) => savedItem.item.category]
		) as Category[];

		this.chartType = 'pie';
		this.options = { animation: { duration: 0 } };
		this.colors = [{
			backgroundColor: this.findLabels().map(label => this.findIconColor(label.code))
		}];

		this.seller = EmployeeService.findEmployee(this.order.sellerCode);
	}

	ngOnInit(): void {
		this.printService.openPrintDialog();
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

	get selectItemOptions(): SelectItemOption[] {
		return InspectionService.selectItemOptions;
	}

	get headerVehicleItem(): string {
		return Constants.HEADER_CARD.VEHICLE;
	}

	// endregion

	findLabels(): SelectItemOption[] {
		const labels = this.selectItemOptions.filter(option =>
			!this.avoidLegendItems.find(code => code === option.code)
		);
		return this.orderPipe.transform(labels);
	}

	groupLabels(
		labels: SelectItemOption[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): SelectItemOption[] {
		const groupedLabels = labels.slice(0, labels.length);
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = groupedLabels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				codes.forEach(code => groupedLabels.splice(groupedLabels.findIndex(label => label.code === code), 1));
				groupedLabels.push(new SelectItemOption({ name, code: codesLabels[0].code, order: codesLabels[0].order }));
			}
		});
		return groupedLabels;
	}

	groupData(
		labels: SelectItemOption[], data: number[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): number[] {
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = labels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				const groupedData = data.filter((v: number, i: number) =>
					codesLabels.find(l => l.order === i + 1)
				).reduce((a, b) => a + b, 0);
				codesLabels.forEach(label =>
					data.splice(data.findIndex((n: number, i: number) => i === label.order - 1), 1)
				);
				data.splice(codesLabels[0].order - 1, 0, groupedData);
			}
		});
		return data;
	}

	findHeaderItems(code: string, items: SavedItem[] = this.savedInspection.items): SavedItem[] {
		return items.filter(item => item.item.header === code);
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectSavedItem(item: SavedItem): SelectSavedItem {
		return item as SelectSavedItem;
	}

	findTextSavedItem(item: SavedItem): TextSavedItem {
		return item as TextSavedItem;
	}

	findSelectIcon(item: SelectSavedItem): string {
		return (item.item as SelectItem).options.find(option => option.code === item.value).printIcon;
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findSelectItems(items: SavedItem[] = this.savedInspection.items): SelectSavedItem[] {
		return items.filter(item => item.item.type === Constants.ITEM_TYPE.SELECT) as SelectSavedItem[];
	}

	checkCategoryElement(item: ListElement): boolean {
		return item instanceof Category;
	}

	checkExistentSelectItems(items: SavedItem[]): boolean {
		return items.filter(i => i.item.type === Constants.ITEM_TYPE.SELECT).length > 0;
	}

	findData(items: SavedItem[] = this.savedInspection.items): number[] {
		const labels = this.findLabels();
		const selectItems = this.findSelectItems(items);
		const data = [];
		labels.forEach(label => {
			data.push(selectItems.filter(item => item.value === label.code).length);
		});
		return this.groupData(labels, data);
	}

	findTextAreaLines(item: TextSavedItem): string[] {
		return item.text ? item.text.split('\n') : [];
	}

	checkWrongItem(savedItem: SavedItem): boolean {
		if (savedItem.item.type !== Constants.ITEM_TYPE.SELECT) {
			return false;
		}
		return (savedItem as SelectSavedItem).value !== Constants.SELECT_ITEM_OPTION_CODE.C;
	}

}
