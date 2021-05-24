import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Inspection} from '../../objects/inspections/inspection';
import {Constants} from '../../objects/constants';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Item} from '../../objects/inspections/items/item';
import {TextItem} from '../../objects/inspections/items/text-item';
import {InspectionService} from '../../services/inspection.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {LegendComponent} from '../bottom-panel/legend/legend.component';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent {

	groupedItems: { [key: string]: Item[] };

	constructor(private bottomSheet: MatBottomSheet) {
		this.groupedItems = {};
		this.inspection.items.forEach(item => {
			if (this.groupedItems[item.garagePosition.name]) {
				this.groupedItems[item.garagePosition.name].push(item);
			} else {
				this.groupedItems[item.garagePosition.name] = [];
			}
		});
	}

	get inspection(): Inspection {
		return InspectionService.inspection;
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
		const selectedIndex = options.findIndex(o => o.selected);
		options[selectedIndex].selected = false;
		options[(selectedIndex + 1) % options.length].selected = true;
	}

	openLegend(options: SelectItemOption[]): void {
		this.bottomSheet.open(LegendComponent, {data: options});
	}

}
