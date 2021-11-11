import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Order } from '../../../objects/orders/order';
import { Constants } from '../../../objects/constants';
import { Vehicle } from '../../../objects/orders/vehicles/vehicle';
import { Car } from '../../../objects/orders/vehicles/car';

@Component({
	selector: 'app-order-info',
	templateUrl: './order-info.component.html',
	styleUrls: ['./order-info.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInfoComponent {

	displayedColumns: string[] = ['description', 'units'];

	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public order: Order) {}

	get carType(): string {
		return Constants.VEHICLE_TYPE.CAR;
	}

	get scooterType(): string {
		return Constants.VEHICLE_TYPE.SCOOTER;
	}

	findCar(vehicle: Vehicle): Car {
		return vehicle as Car;
	}

}
