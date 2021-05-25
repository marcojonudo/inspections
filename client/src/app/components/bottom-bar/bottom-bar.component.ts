import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {InspectionService} from '../../services/inspection.service';
import {Order} from '../../objects/orders/order';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {OrderInfoComponent} from '../bottom-panel/order-info/order-info.component';
import {EmployeeInfoComponent} from '../bottom-panel/employee-info/employee-info.component';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	constructor(private bottomSheet: MatBottomSheet, private cdRef: ChangeDetectorRef) {}

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
		this.bottomSheet.open(EmployeeInfoComponent);
	}

}
