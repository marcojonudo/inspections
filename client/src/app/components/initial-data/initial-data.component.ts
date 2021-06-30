import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, OnInit,
	ViewChild
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {Constants} from '../../objects/constants';
import {finalize} from 'rxjs/operators';
import {InspectionService} from '../../services/inspection.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatInput} from '@angular/material/input';
import {LoadingService} from '../../services/loading.service';
import {inOutAnimation, inOutTranslateAnimation} from '../../animations';
import {LocalStorageService} from '../../services/local-storage.service';

@Component({
	selector: 'app-initial-data',
	templateUrl: './initial-data.component.html',
	styleUrls: ['./initial-data.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [inOutTranslateAnimation, inOutAnimation]
})
export class InitialDataComponent implements OnInit, AfterViewInit {

	@ViewChild('employeeCodeInput') employeeCodeInput: MatInput;
	@ViewChild('orderCodeInput') orderCodeInput: MatInput;

	employeeCode: FormControl;
	orderCode: FormControl;

	employee: Employee;

	searchingInspections: boolean;

	constructor(
		private inspectionService: InspectionService,
		private loadingService: LoadingService,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute
	) {
		this.employeeCode = new FormControl(
			'', [Validators.required, Validators.minLength(this.employeeCodeLength)]
		);
		this.orderCode = new FormControl('', [Validators.required]);
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe((data: { employees: any }) => {
			EmployeeService.setEmployees(data.employees);
			this.loadingService.stop();
		});
	}

	ngAfterViewInit(): void {
		this.employeeCodeInput.focus();
	}

	get employeeCodeLength(): number {
		return Constants.EMPLOYEE_CODE_LENGTH;
	}

	setEmployeeFocus(): void {
		this.employeeCodeInput.focus();
	}

	setOrderCodeFocus(): void {
		this.orderCodeInput.focus();
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
		const employee = EmployeeService.setEmployee(employeeCode.value);
		if (employee) {
			this.employee = employee;
			setTimeout(
				() => this.orderCodeInput.focus(),
				0
			);
		}
	}

	checkDisableSearchOrderButton(
		orderCode: FormControl = this.orderCode, searchingInspection: boolean = this.searchingInspections
	): boolean {
		return orderCode.invalid || searchingInspection;
	}

	searchOrder(orderCode: FormControl = this.orderCode): void {
		this.searchingInspections = true;

		this.inspectionService.findInspection(orderCode.value).pipe(
			finalize(() => {
				LocalStorageService.setItem(Constants.LOCAL_STORAGE.RESET_EMPLOYEE, false);
				this.searchingInspections = false;
				this.cdRef.detectChanges();
			})
		).subscribe(() => {
			this.router.navigate([Constants.PATH.INSPECTION]);
		});
	}

}
