import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Url} from '../objects/url';
import {Order} from '../objects/orders/order';
import {Inspection} from '../objects/inspections/inspection';
import {SavedInspection} from '../objects/inspections/saved-inspection';
import * as dayjs from 'dayjs';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';
import {EmployeeService} from './employee.service';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	constructor(private http: HttpClient) {}

	static order: Order;
	static inspection: Inspection;

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
