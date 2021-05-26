import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {Constants} from '../../objects/constants';
import {finalize} from 'rxjs/operators';
import {InspectionService} from '../../services/inspection.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

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
					animate('.2s', style({ opacity: 1, transform: 'translateY(0)' }))
				]
			),
			transition(
				':leave',
				[
					style({ opacity: 1, transform: 'translateY(0)' }),
					animate('.2s', style({ opacity: 0, transform: 'translateY(25px)' }))
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

	employeeCode: FormControl;
	orderCode: FormControl;

	employee: Employee;

	searchingInspections: boolean;

	constructor(
		private inspectionService: InspectionService,
		private router: Router,
		private snackBar: MatSnackBar,
		private cdRef: ChangeDetectorRef
	) {
		this.employeeCode = new FormControl(
			'', [Validators.required, Validators.minLength(this.employeeCodeLength)]
		);
		this.orderCode = new FormControl('', [Validators.required]);
	}

	get employeeCodeLength(): number {
		return Constants.EMPLOYEE_CODE_LENGTH;
	}

	getEmployeeCodeErrorMessage(employeeCode: FormControl = this.employeeCode) {
		if (employeeCode.hasError('required')) {
			return 'Debes introducir un código de empleado';
		}
		return 'Longitud mínima de 7 dígitos';
	}

	getOrderCodeErrorMessage() {
		return 'Debes introducir un código de orden';
	}

	searchEmployee(employeeCode: FormControl = this.employeeCode): void {
		this.employee = EmployeeService.setEmployee(employeeCode.value);
	}

	searchOrder(orderCode: FormControl = this.orderCode): void {
		this.searchingInspections = true;

		this.inspectionService.findInspection(orderCode.value).pipe(
			finalize(() => {
				this.searchingInspections = false;
				this.cdRef.detectChanges();
			})
		).subscribe(() => {
			this.router.navigate([Constants.PATH.INSPECTION]);
		});
	}

}
