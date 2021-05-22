import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Inspection} from '../../objects/inspections/inspection';
import {Constants} from '../../objects/constants';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Item} from '../../objects/inspections/items/item';
import {TextItem} from '../../objects/inspections/items/text-item';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent implements OnInit {

	@Input() inspection: Inspection;

	@HostBinding('style.height') get height(): string {
		return `calc(100% - ${Constants.BOTTOM_BAR_HEIGHT_REM}rem`;
	}

	groupedItems: { [key: string]: Item[] };
	openedLegendItems: SelectItem[];
	itemDimensions: number[];

	constructor(private cdRef: ChangeDetectorRef) {
		this.openedLegendItems = [];
	}

	ngOnInit(): void {
		this.groupedItems = {};
		this.inspection.items.forEach(item => {
			if (this.groupedItems[item.garagePosition.name]) {
				this.groupedItems[item.garagePosition.name].push(item);
			} else {
				this.groupedItems[item.garagePosition.name] = [];
			}
		});
		this.itemDimensions = this.inspection.items.map(() => 0);
	}

	get selectType(): string {
		return Constants.ITEM_TYPE.SELECT;
	}

	get textType(): string {
		return Constants.ITEM_TYPE.TEXT;
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

	toggleSelectOption(options: SelectItemOption[], item: SelectItem): void {
		console.log('togglin');
		const selectedIndex = options.findIndex(o => o.selected);
		options[selectedIndex].selected = false;
		options[(selectedIndex + 1) % options.length].selected = true;
		this.cdRef.detectChanges();
	}

	toggleLegend(item: SelectItem, openedLegendItems: SelectItem[] = this.openedLegendItems): void {
		const openedIndex = openedLegendItems.findIndex(i => i.name === item.name);
		if (openedIndex === -1) {
			openedLegendItems.push(item);
		} else {
			openedLegendItems.splice(openedIndex, 1);
		}
		this.cdRef.detectChanges();
	}

	findOptionsHeight(item: SelectItem, openedLegendItems: SelectItem[] = this.openedLegendItems): number {
		const opened = openedLegendItems.find(i => i.name === item.name);
		return opened ? item.options.length * Constants.SELECT_OPTION_HEIGHT_REM : 0;
	}

}
