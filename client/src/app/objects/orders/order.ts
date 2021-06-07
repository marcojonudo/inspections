import {OrderLine} from './order-line';
import {Vehicle} from './vehicle';

export class Order {

	number: number;
	code: string;
	vehicle: Vehicle;
	lines: OrderLine[];

	constructor(order: any, code: string) {
		this.number = order.number;
		this.code = code;
		this.vehicle = new Vehicle(order.vehicle);
		this.lines = order.lines.map(line => new OrderLine(line));
	}

}
