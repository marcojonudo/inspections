import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component, EventEmitter, Output,
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {InspectionService} from '../../services/inspection.service';
import {Order} from '../../objects/orders/order';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {OrderInfoComponent} from '../bottom-panel/order-info/order-info.component';
import {EmployeeInfoComponent} from '../bottom-panel/employee-info/employee-info.component';
import {MenuComponent} from '../bottom-panel/menu/menu.component';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	@Output() foundInspectionEmitter: EventEmitter<boolean>;

	openedMenu: boolean;

	constructor(private bottomSheet: MatBottomSheet, private cdRef: ChangeDetectorRef) {
		this.foundInspectionEmitter = new EventEmitter<boolean>();
	}

	get employee(): Employee {
		return EmployeeService.employee;
	}

	get order(): Order {
		return InspectionService.order;
	}

	openOrder(order: Order = this.order): void {
		this.bottomSheet.open(OrderInfoComponent, {data: order});
	}

	openEmployee(employee: Employee = this.employee): void {
		const bottomSheetRef = this.bottomSheet.open(EmployeeInfoComponent, {data: employee.code});
		bottomSheetRef.afterDismissed().subscribe((triggerCd: boolean) => {
			if (triggerCd) {
				this.cdRef.detectChanges();
			}
		});
	}

	openToolsMenu(): void {
		this.openedMenu = true;

		const bottomSheetRef = this.bottomSheet.open(MenuComponent);
		bottomSheetRef.afterDismissed().subscribe((foundInspection: boolean) => {
			this.openedMenu = false;
			this.cdRef.detectChanges();
			if (foundInspection) {
				this.foundInspectionEmitter.emit(foundInspection);
			}
		});
	}

}
