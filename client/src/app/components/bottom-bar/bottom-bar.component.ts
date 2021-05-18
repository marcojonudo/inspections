import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	Input,
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {InspectionService} from '../../services/inspection.service';
import {Order} from '../../objects/order';

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	@Input() inspections: any;

	@HostBinding('style.transform') get translateY(): string {
		return `translateY(${this.inspections ? 0 : '100%'})`;
	}

	get employee(): Employee {
		return EmployeeService.employee;
	}

	get order(): Order {
		console.log(InspectionService.order);
		return InspectionService.order;
	}

}
