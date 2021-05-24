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
import {Constants} from '../../objects/constants';
import {Inspection} from '../../objects/inspections/inspection';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	@Input() inspection: Inspection;
	@Output() orderEmitter: EventEmitter<Order>;

	openedOrder: Order;

	// @HostBinding('style.height.rem') get height(): number {
	// 	return Constants.BOTTOM_BAR_HEIGHT_REM;
	// }
	//
	// @HostBinding('style.transform') get translateY(): string {
	// 	return `translateY(${this.inspection ? 0 : '100%'})`;
	// }

	constructor() {
		this.orderEmitter = new EventEmitter<Order>();
	}

	get employee(): Employee {
		return EmployeeService.employee;
	}

	get order(): Order {
		return InspectionService.order;
	}

	openOrder(order: Order = InspectionService.order): void {
		this.openedOrder = this.openedOrder ? undefined : order;
		this.orderEmitter.emit(this.openedOrder);
	}

}
