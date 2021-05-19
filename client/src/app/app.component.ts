import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {EmployeeService} from './services/employee.service';
import {NotificationService} from './services/notification.service';
import {PanelInfo} from './objects/panel-info/panel-info';
import {Order} from './objects/orders/order';
import {OrderPanelInfo} from './objects/panel-info/order-info';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('inOutAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0 }),
					animate('.3s', style({ opacity: 1 }))
				]
			),
			transition(
				':leave',
				[
					style({ opacity: 1 }),
					animate('.3s', style({ opacity: 0 }))
				]
			)
		])
	]
})
export class AppComponent implements AfterViewInit {

	title = 'Revisiones';

	inspections: any;
	panelInfo: PanelInfo;

	constructor(private cdRef: ChangeDetectorRef) {
		EmployeeService.init();
		NotificationService.init();
	}

	ngAfterViewInit(): void {
		this.cdRef.detach();
	}

	setInspections(inspections: any): void {
		this.inspections = inspections;
		this.cdRef.detectChanges();
	}

	setOrderPanelInfo(order: Order): void {
		this.panelInfo = order ? new OrderPanelInfo(order) : undefined;
		this.cdRef.detectChanges();
	}

}
