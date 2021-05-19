import {environment} from '../../environments/environment';

export class Url {

	static inspections(): string {
		return `${environment.serverUrl}/inspections/inspection`;
	}

	static order(): string {
		return `${environment.serverUrl}/inspections/order`;
	}

}
