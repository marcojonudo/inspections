import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, EventEmitter, Input, Output,
} from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';
import { InspectionService } from '../../services/inspection.service';
import { Order } from '../../objects/orders/order';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { OrderInfoComponent } from '../bottom-panel/order-info/order-info.component';
import { EmployeeInfoComponent } from '../bottom-panel/employee-info/employee-info.component';
import { PrintService } from '../../services/print.service';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { finalize } from 'rxjs/operators';
import { Constants } from '../../objects/constants';
import { SnackBarService } from '../../services/snack-bar.service';
import { InspectionVehicle } from '../../objects/inspections/inspection-vehicle';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	@Input() employee: Employee;
	@Input() openedMenu: boolean;
	@Output() foundInspectionEmitter: EventEmitter<boolean>;

	saving: boolean;

	constructor(
		private inspectionService: InspectionService,
		private printService: PrintService,
		private translate: TranslateService,
		private snackBarService: SnackBarService,
		private bottomSheet: MatBottomSheet,
		private cdRef: ChangeDetectorRef
	) {
		this.foundInspectionEmitter = new EventEmitter<boolean>();
	}

	// region Getters / setters

	get order(): Order {
		return InspectionService.order;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.savedInspection;
	}

	get menuToggle(): string {
		return Constants.MENU_TOGGLE;
	}

	// endregion

	openOrder(order: Order = this.order): void {
		this.bottomSheet.open(OrderInfoComponent, { data: order });
	}

	openEmployee(employee: Employee = this.employee): void {
		const bottomSheetRef = this.bottomSheet.open(EmployeeInfoComponent, { data: employee.code });
		bottomSheetRef.afterDismissed().subscribe((triggerCd: boolean) => {
			if (triggerCd) {
				this.employee = EmployeeService.employee;
				this.cdRef.detectChanges();
			}
		});
	}

	toggleMenu(): void {
		this.openedMenu = !this.openedMenu;
		this.cdRef.detectChanges();
	}

	findMenuButtonTranslate(i: number, openedMenu: boolean = this.openedMenu): string {
		return openedMenu ? `translateY(-${i * 110}%)` : '';
	}

	saveInspection(savedInspection: SavedInspection = this.savedInspection): void {
		this.saving = true;
		this.inspectionService.saveInspection(savedInspection).pipe(
			finalize(() => {
				this.saving = false;
				this.openedMenu = false;
				this.cdRef.detectChanges();
			})
		).subscribe(
			() => this.snackBarService.open(Constants.MESSAGE_CODE.SAVED_INSPECTION),
			() => this.snackBarService.open(Constants.MESSAGE_CODE.ERROR_SAVING_INSPECTION, Constants.SNACK_BAR.TYPE.ERROR)
		);
	}

	print(inspection: InspectionVehicle = InspectionService.inspection): void {
		const completeInspection = InspectionService.checkCompleteItems(inspection.items);
		if (completeInspection) {
			this.printService.print();
		} else {
			this.snackBarService.open(Constants.MESSAGE_CODE.NON_COMPLETE_INSPECTION, Constants.SNACK_BAR.TYPE.WARNING);
		}
		this.openedMenu = false;
	}

	resetInspection(): void {
		InspectionService.resetInspection();
		this.openedMenu = false;
	}

}
