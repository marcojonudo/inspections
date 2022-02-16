import { OrderLine } from './order-line';
import { Client } from './client';
import { Vehicle } from './vehicles/vehicle';
import { Builder } from '../builder';

export class Order {

	number: number;
	code: string;
	vehicle: Vehicle;
	client: Client;
	sellerCode: string;
	vehicleType: string;
	lines: OrderLine[];

	constructor(order: any, code: string) {
		this.number = order.number;
		this.code = code;
		this.vehicle = Builder.buildVehicle(order.vehicle);
		this.client = new Client(order.client);
		this.sellerCode = order.sellerCode;
		this.vehicleType = order.vehicleType;
		this.lines = order.lines.map(line => new OrderLine(line));
	}

}
