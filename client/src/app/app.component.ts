import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {EmployeeService} from './services/employee.service';
import {NotificationService} from './services/notification.service';
import {PanelInfo} from './objects/panel-info/panel-info';
import {Order} from './objects/orders/order';
import {OrderPanelInfo} from './objects/panel-info/order-info';
import {Inspection} from './objects/inspections/inspection';
import 'hammerjs';
import {Employee} from './objects/employee';
import {InspectionService} from './services/inspection.service';

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
export class AppComponent {

	title = 'Revisiones';

	constructor() {
		EmployeeService.init();
		NotificationService.init();
	}

}
