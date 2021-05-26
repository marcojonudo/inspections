import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Url} from '../objects/url';
import {Order} from '../objects/orders/order';
import {Inspection} from '../objects/inspections/inspection';
import {SavedInspection} from '../objects/inspections/saved-inspection';
import * as dayjs from 'dayjs';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';
import {EmployeeService} from './employee.service';
import {catchError, concatMap, finalize, map} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TextItem} from '../objects/inspections/items/text-item';
import {SelectItem} from '../objects/inspections/items/select-item';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {


	static order: Order;
	static inspection: Inspection;
	itemBuilder: any;

	constructor(private http: HttpClient, private snackBar: MatSnackBar) {
		this.itemBuilder = {
			TEXT: (item: any) => new TextItem(item),
			SELECT: (item: any) => new SelectItem(item)
		};
	}

	static setOrder(order: Order): Order {
		this.order = order;
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.ORDER, order);
		return this.order;
	}

	static setInspection(inspection: Inspection): Inspection {
		this.inspection = inspection;
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.INSPECTION, inspection);
		return this.inspection;
	}

	static loadInfo(): void {
		this.inspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION);
		this.order = LocalStorageService.getItem(Constants.LOCAL_STORAGE.ORDER);
		EmployeeService.employee = LocalStorageService.getItem(Constants.LOCAL_STORAGE.EMPLOYEE);
	}

	findInspection(orderCode: string): Observable<any> {
		let errorText;
		return this.findOrder(orderCode).pipe(
			catchError(error => {
				errorText = Constants.MESSAGE.NONEXISTENT_ORDER;
				return throwError(error);
			}),
			concatMap((order: any) => {
				const or = InspectionService.setOrder(new Order(order, orderCode));
				return this.findInspections(or.number);
			}),
			catchError(error => {
				errorText = errorText ? errorText : Constants.MESSAGE.NONEXISTENT_INSPECTIONS;
				return throwError(error);
			}),
			map((inspection: any) => {
				console.log('Received inspection', inspection);
				const items = inspection.items.map(item => this.itemBuilder[item.type](item));
				const builtInspection = new Inspection(inspection, items);
				console.log('Inspection', builtInspection);
				InspectionService.setInspection(builtInspection);
			}),
			finalize(() => {
				if (errorText) {
					this.snackBar.open(
						errorText, '', {verticalPosition: 'top', duration: Constants.SNACK_BAR.DURATION, panelClass: 'warning-snack-bar'}
					);
				}
			})
		);
	}

	findOrder(shortCode: string): Observable<any> {
		const url = `${Url.order()}?shortCode=${shortCode}`;
		return this.http.get(url);
	}

	findInspections(orderNumber: number): Observable<any> {
		const url = `${Url.inspection()}?orderNumber=${orderNumber}`;
		return this.http.get(url);
	}

	saveInspection(inspection: SavedInspection): Observable<any> {
		inspection.saved = dayjs();
		return this.http.post(Url.inspection(), inspection);
	}

}
