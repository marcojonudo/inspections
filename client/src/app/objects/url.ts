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

	static info(): string {
		return `${environment.serverUrl}/info`.replace('localhost', '192.9.84.1');
	}

	static changelog(): string {
		return `${environment.serverUrl}/changelog`;
	}

}
