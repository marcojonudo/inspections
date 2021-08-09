import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component, ElementRef, OnInit,
	ViewChild
} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {Constants} from '../../objects/constants';
import {finalize} from 'rxjs/operators';
import {InspectionService} from '../../services/inspection.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MatInput} from '@angular/material/input';
import {LoadingService} from '../../services/loading.service';
import {inOutAnimation, inOutTranslateAnimation} from '../../animations';
import {LocalStorageService} from '../../services/local-storage.service';
import {fromEvent, Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {SnackBarService} from '../../services/snack-bar.service';

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
	@ViewChild('searchOrderButton', { read: ElementRef }) searchOrderButton: ElementRef;

	employeeCode: FormControl;
	orderCode: FormControl;

	employee: Employee;

	searchingInspections: boolean;

	constructor(
		private inspectionService: InspectionService,
		private loadingService: LoadingService,
		private router: Router,
		private cdRef: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private translateService: TranslateService,
		private snackBarService: SnackBarService
	) {
		clearTimeout(InspectionService.lockTimeout);
		this.employee = EmployeeService.employee;
		const employeeCode = this.employee ? this.employee.code : '';
		this.employeeCode = new FormControl(
			employeeCode,
			[Validators.required].concat(InspectionService.countryHandler.findEmployeeCodeCustomValidations())
		);
		this.orderCode = new FormControl('', [Validators.required]);
	}

	ngOnInit(): void {
		this.activatedRoute.data.subscribe((data: { employees: any }) => {
			if (!data.employees.length) {
				this.snackBarService.open(
					Constants.MESSAGE_CODE.ERROR_FINDING_EMPLOYEES, Constants.SNACK_BAR.TYPE.WARNING
				);
			}
			EmployeeService.setEmployees(data.employees);
			this.loadingService.stop();
		});
	}

	ngAfterViewInit(): void {
		if (this.employee) {
			this.orderCodeInput.focus();
		} else {
			this.employeeCodeInput.focus();
		}
		fromEvent(this.searchOrderButton.nativeElement, Constants.EVENT.CLICK).subscribe((event: MouseEvent) => {
			/* Se evita que un clic en el botón abra el teclado automáticamente (al ejecutarse el click de la ficha) */
			event.stopPropagation();
			this.searchOrder();
		});
	}

	get employeeCodeMaxLength(): number {
		return Constants.EMPLOYEE_CODE_MAX_LENGTH;
	}

	setEmployeeFocus(): void {
		this.employeeCodeInput.focus();
	}

	setOrderCodeFocus(): void {
		this.orderCodeInput.focus();
	}

	findEmployeeCodeInputType(): string {
		return InspectionService.countryHandler.findEmployeeCodeInputType();
	}

	findEmployeeCodePlaceholder(): string {
		return InspectionService.countryHandler.findEmployeeCodePlaceholder();
	}

	getEmployeeCodeErrorMessage(employeeCode: FormControl = this.employeeCode): Observable<string> {
		const messageCode = employeeCode.hasError(Constants.REQUIRED) ?
			Constants.REQUIRED_EMPLOYEE_CODE : Constants.EMPLOYEE_CODE_MIN_LENGTH;
		return this.translateService.get(`init.${messageCode}`);
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
		this.cdRef.detectChanges();

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
