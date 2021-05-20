import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit} from '@angular/core';
import {Inspection} from '../../objects/inspections/inspection';
import {Constants} from '../../objects/constants';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {SelectItemOption} from '../../objects/inspections/items/select-item-option';
import {Item} from '../../objects/inspections/items/item';

@Component({
	selector: 'app-inspection',
	templateUrl: './inspection.component.html',
	styleUrls: ['./inspection.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InspectionComponent {

	@Input() inspection: Inspection;

	@HostBinding('style.height') get height(): string {
		return `calc(100% - ${Constants.BOTTOM_BAR_HEIGHT_REM}rem`;
	}

	constructor(private cdRef: ChangeDetectorRef) {}

	get selectType(): string {
		return Constants.ITEM_TYPE.SELECT;
	}

	checkItemType(optionType: string, type: string): boolean {
		return optionType === type;
	}

	findSelectItem(item: Item): SelectItem {
		return item as SelectItem;
	}

	checkLeftOption(options: SelectItemOption[], i: number): boolean {
		return i < options.findIndex(o => o.selected);
	}

	checkRightOption(options: SelectItemOption[], i: number): boolean {
		return i > options.findIndex(o => o.selected);
	}

	toggle(options: SelectItemOption[]): void {
		const selectedIndex = options.findIndex(o => o.selected);
		options[selectedIndex].selected = false;
		options[(selectedIndex + 1) % options.length].selected = true;
		this.cdRef.detectChanges();
	}

}
