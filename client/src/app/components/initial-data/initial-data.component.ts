import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {EmployeeService} from "../../services/employee.service";
import {Employee} from "../../objects/employee";
import {Constants} from "../../objects/constants";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, concatMap, finalize} from "rxjs/operators";
import {InspectionService} from "../../services/inspection.service";
import {of, throwError} from "rxjs";
import {NotificationService} from "../../services/notification.service";
import {SuccessToast} from "../../objects/toasts/success-toast";
import {WarningToast} from "../../objects/toasts/warning-toast";
import {animate, style, transition, trigger} from "@angular/animations";

@Component({
	selector: 'app-initial-data',
	templateUrl: './initial-data.component.html',
	styleUrls: ['./initial-data.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('inOutTranslateAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0, transform: 'translateY(25px)' }),
					animate('.5s', style({ opacity: 1, transform: 'translateY(0)' }))
				]
			),
			transition(
				':leave',
				[
					style({ opacity: 1, transform: 'translateY(0)' }),
					animate('.5s', style({ opacity: 0, transform: 'translateY(25px)' }))
				]
			)
		]),
		trigger('inOutAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0 }),
					animate('.2s', style({ opacity: 1 }))
				]
			),
			transition(
				':leave',
				[
					style({ opacity: 1 }),
					animate('.2s', style({ opacity: 0 }))
				]
			)
		])
	]
})
export class InitialDataComponent {

	form: FormGroup;

	employeeCode: string;
	employee: Employee;

	orderCode: string;
	searchingInspections: boolean;

	loadedInspections: boolean;

	constructor(private cdRef: ChangeDetectorRef, private inspectionService: InspectionService) {
		this.employeeCode = '';
		this.orderCode = '';
		this.form = new FormGroup({
			employeeCode: new FormControl('', [Validators.required, Validators.minLength(Constants.EMPLOYEE_CODE_LENGTH)]),
			orderCode: new FormControl('', Validators.required)
		});
	}

	checkEmployeeCodeLength(employeeCode: string = this.employeeCode): boolean {
		return employeeCode.length >= Constants.EMPLOYEE_CODE_LENGTH;
	}

	checkEmptyOrderCode(orderCode: string = this.orderCode): boolean {
		return orderCode == '';
	}

	checkDisableSearchOrderButton(
		orderCode: string = this.orderCode, searching: boolean = this.searchingInspections
	): boolean {
		return orderCode == '' || searching;
	}

	searchEmployee(employeeCode: string = this.employeeCode): void {
		const employee = EmployeeService.findEmployee(employeeCode);
		if (employee) {
			this.employee = employee;
		}
		this.cdRef.detectChanges();
	}

	searchOrder(shortCode: string = this.orderCode): void {
		this.searchingInspections = true;
		this.cdRef.detectChanges();

		let errorText;
		this.inspectionService.findOrderNumber(shortCode).pipe(
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_ORDER;
				return throwError(error);
			}),
			concatMap((orderNumber: number) => {
				return this.inspectionService.findInspections(orderNumber);
			}),
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_INSPECTIONS;
				return throwError(error);
			}),
			finalize(() => {
				this.searchingInspections = false;
				if (errorText) {
					NotificationService.notifyToast(new WarningToast(errorText));
				}
				this.cdRef.detectChanges();
			})
		).subscribe(
			(data) => {
				this.loadedInspections = true
			}
		);
	}

	triggerCd(): void {
		this.cdRef.detectChanges();
	}

}
