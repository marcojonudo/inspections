import {
	ChangeDetectionStrategy,
	Component, EventEmitter,
	HostBinding,
	Input, Output,
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {InspectionService} from '../../services/inspection.service';
import {Order} from '../../objects/orders/order';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {OrderInfoComponent} from '../bottom-panel/order-info/order-info.component';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	constructor(private bottomSheet: MatBottomSheet) {}

	get employee(): Employee {
		return EmployeeService.employee;
	}

	get order(): Order {
		return InspectionService.order;
	}

	openOrder(order: Order = this.order): void {
		this.bottomSheet.open(OrderInfoComponent, {data: order});
	}

}
