import { OrderLine } from './order-line';
import { Client } from './client';
import { Vehicle } from './vehicles/vehicle';
import { Builder } from '../builder';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class Order {

	number: number;
	code: string;
	day: Dayjs;
	vehicle: Vehicle;
	client: Client;
	sellerCode: string;
	vehicleType: string;
	lines: OrderLine[];

	constructor(order: any) {
		this.number = order.number;
		this.code = order.code;
		this.day = dayjs(order.day);
		this.vehicle = Builder.buildVehicle(order.vehicle);
		this.client = new Client(order.client);
		this.sellerCode = order.sellerCode;
		this.vehicleType = this.vehicle.type;
		this.lines = order.lines.map(line => new OrderLine(line));
	}

}
