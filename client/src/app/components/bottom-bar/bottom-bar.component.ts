import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../services/employee.service";
import {Constants} from "../../objects/constants";
import {Employee} from "../../objects/employee";
import {concatMap, finalize} from "rxjs/operators";
import {InspectionService} from "../../services/inspection.service";

@Component({
	selector: 'app-bottom-bar',
	templateUrl: './bottom-bar.component.html',
	styleUrls: ['./bottom-bar.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomBarComponent {

	employee: Employee;
	orderCode: string;
	searchingInspections: boolean;

	constructor(private cdRef: ChangeDetectorRef, private inspectionService: InspectionService) {}

	get userCodePlaceholder(): string {
		return Constants.USER_CODE_PLACEHOLDER;
	}

	get orderCodePlaceholder(): string {
		return Constants.ORDER_CODE_PLACEHOLDER;
	}

	searchEmployee(employeeCode: string): void {
		const employee = EmployeeService.findEmployee(employeeCode);
		if (employee) {
			this.employee = employee;
			this.cdRef.detectChanges();
		}
	}

	searchOrder(shortCode: string = this.orderCode): void {
		this.searchingInspections = true;
		this.cdRef.detectChanges();

		this.inspectionService.findOrderNumber(shortCode).pipe(
			concatMap((orderNumber: number) => {
				console.log(1, orderNumber);
				return this.inspectionService.findInspections(orderNumber);
			}),
			finalize(() => {
				this.searchingInspections = false;
				this.cdRef.detectChanges();
			})
		).subscribe((data) => {
			console.log(data);
		});
	}

}
