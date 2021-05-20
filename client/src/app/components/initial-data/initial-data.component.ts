import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output} from '@angular/core';
import {EmployeeService} from '../../services/employee.service';
import {Employee} from '../../objects/employee';
import {Constants} from '../../objects/constants';
import {catchError, concatMap, finalize} from 'rxjs/operators';
import {InspectionService} from '../../services/inspection.service';
import {throwError} from 'rxjs';
import {NotificationService} from '../../services/notification.service';
import {WarningToast} from '../../objects/toasts/warning-toast';
import {animate, style, transition, trigger} from '@angular/animations';
import {Order} from '../../objects/orders/order';
import {TextItem} from '../../objects/inspections/items/text-item';
import {SelectItem} from '../../objects/inspections/items/select-item';
import {Inspection} from '../../objects/inspections/inspection';

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

	@Output() inspectionsEmitter: EventEmitter<Inspection>;

	employeeCode: string;
	employee: Employee;

	orderCode: string;
	searchingInspections: boolean;

	itemBuilder: any;

	constructor(private cdRef: ChangeDetectorRef, private inspectionService: InspectionService) {
		this.employeeCode = '';
		this.orderCode = '';
		this.inspectionsEmitter = new EventEmitter<Inspection>();

		this.itemBuilder = {
			TEXT: (item: any) => new TextItem(item),
			SELECT: (item: any) => new SelectItem(item)
		};
	}

	checkEmployeeCodeLength(employeeCode: string = this.employeeCode): boolean {
		return employeeCode.length >= Constants.EMPLOYEE_CODE_LENGTH;
	}

	checkDisableSearchOrderButton(
		orderCode: string = this.orderCode, searching: boolean = this.searchingInspections
	): boolean {
		return orderCode === '' || searching;
	}

	searchEmployee(employeeCode: string = this.employeeCode): void {
		this.employee = EmployeeService.setEmployee(employeeCode);
		this.cdRef.detectChanges();
	}

	searchOrder(shortCode: string = this.orderCode): void {
		this.searchingInspections = true;
		this.cdRef.detectChanges();

		let errorText;
		this.inspectionService.findOrder(shortCode).pipe(
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_ORDER;
				return throwError(error);
			}),
			concatMap((order: any) => {
				const or = InspectionService.setOrder(new Order(order, shortCode));
				return this.inspectionService.findInspections(or.number);
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
		).subscribe((inspection: any) => {
			console.log('Received inspection', inspection);
			const items = inspection.items.map(item => this.itemBuilder[item.type](item));
			const builtInspection = new Inspection(inspection, items);
			console.log('Inspection', builtInspection);
			this.inspectionsEmitter.emit(builtInspection);
		});
	}

	triggerCd(): void {
		this.cdRef.detectChanges();
	}

}
