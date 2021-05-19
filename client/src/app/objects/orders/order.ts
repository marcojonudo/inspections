import {OrderLine} from './order-line';

export class Order {

	number: number;
	code: string;
	lines: OrderLine[];

	constructor(order: any, code: string) {
		this.number = order.number;
		this.code = code;
		this.lines = order.lines.map(line => new OrderLine(line));
	}

}
