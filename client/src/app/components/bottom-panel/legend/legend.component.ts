import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {SelectItemOption} from '../../../objects/inspections/items/select-item-option';
import {InspectionService} from '../../../services/inspection.service';

@Component({
	selector: 'app-legend',
	templateUrl: './legend.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegendComponent {

	constructor(
		private bottomSheetRef: MatBottomSheetRef<LegendComponent>,
		@Inject(MAT_BOTTOM_SHEET_DATA) public options: SelectItemOption[]
	) {}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	selectOption(option: SelectItemOption): void {
		this.bottomSheetRef.dismiss(option);
	}

}
