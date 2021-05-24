import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EmployeeService} from './services/employee.service';
import {NotificationService} from './services/notification.service';
import 'hammerjs';
import {RouterOutlet} from '@angular/router';
import {routeAnimations} from './animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [routeAnimations]
})
export class AppComponent {

	title = 'Revisiones';

	constructor() {
		EmployeeService.init();
		NotificationService.init();
	}

	prepareRoute(outlet: RouterOutlet): void {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}

}
