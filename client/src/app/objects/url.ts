import {environment} from '../../environments/environment';

export class Url {

	static inspection(): string {
		return `${environment.serverUrl}/inspections/inspection`;
	}

	static orderInfo(): string {
		return `${environment.serverUrl}/inspections/order`;
	}

	static employees(): string {
		return `${environment.serverUrl}/inspections/employees`;
	}

	static language(): string {
		return `${environment.serverUrl}/inspections/language`;
	}

	static info(): string {
		return `${environment.serverUrl}/info`;
	}

	static changelog(): string {
		return `${environment.serverUrl}/changelog`;
	}

	static image(orderNumber: number, code: string): string {
		return `${environment.serverUrl}/inspections/image?orderNumber=${orderNumber}&itemCode=${code}`;
	}

}
