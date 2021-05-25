import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {Constants} from '../../objects/constants';
import {catchError, concatMap, finalize} from 'rxjs/operators';
import {InspectionService} from '../../services/inspection.service';
import {throwError} from 'rxjs';
import {animate, style, transition, trigger} from '@angular/animations';
import {Order} from '../../objects/orders/order';
import {TextItem} from '../../objects/inspections/items/text-item';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {Inspection} from '../../objects/inspections/inspection';
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

	itemBuilder: any;

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

		this.itemBuilder = {
			TEXT: (item: any) => new TextItem(item),
			SELECT: (item: any) => new SelectItem(item)
		};
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

		let errorText;
		this.inspectionService.findOrder(orderCode.value).pipe(
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_ORDER;
				return throwError(error);
			}),
			concatMap((order: any) => {
				const or = InspectionService.setOrder(new Order(order, orderCode.value));
				return this.inspectionService.findInspections(or.number);
			}),
			catchError(error => {
				errorText = errorText ? errorText : Constants.MESSAGE.NONEXISTENT_INSPECTIONS;
				return throwError(error);
			}),
			finalize(() => {
				this.searchingInspections = false;
				this.cdRef.detectChanges();
				if (errorText) {
					this.snackBar.open(
						errorText, '', {verticalPosition: 'top', duration: Constants.SNACK_BAR.DURATION, panelClass: 'warning-snack-bar'}
					);
				}
			})
		).subscribe((inspection: any) => {
			console.log('Received inspection', inspection);
			const items = inspection.items.map(item => this.itemBuilder[item.type](item));
			const builtInspection = new Inspection(inspection, items);
			console.log('Inspection', builtInspection);
			InspectionService.setInspection(builtInspection);
			this.router.navigate([Constants.PATH.INSPECTION]);
		});
	}

}
