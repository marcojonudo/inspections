import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Url} from '../objects/url';
import {Order} from '../objects/orders/order';
import {Inspection} from '../objects/inspections/inspection';
import {SavedInspection} from '../objects/inspections/saved-inspection';
import * as dayjs from 'dayjs';

@Injectable({
	providedIn: 'root'
})
export class InspectionService {

	constructor(private http: HttpClient) {}

	static order: Order;
	static inspection: Inspection;

	static setOrder(order: Order): Order {
		this.order = order;
		return this.order;
	}

	static setInspection(inspection: Inspection): Inspection {
		this.inspection = inspection;
		return this.inspection;
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
