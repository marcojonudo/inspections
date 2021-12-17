import {environment} from '../../environments/environment';

export class Url {

	static savedInspection(orderNumber: number, orderInspection: boolean): string {
		return `${environment.serverUrl}/inspections/savedInspection?orderNumber=${orderNumber}&orderInspection=${orderInspection}`;
	}

	static inspection(orderNumber: number = undefined): string {
		return `${environment.serverUrl}/inspections/inspection?orderNumber=${orderNumber}`;
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
