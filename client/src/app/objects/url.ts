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

}
