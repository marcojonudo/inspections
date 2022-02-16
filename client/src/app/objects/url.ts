import {environment} from '../../environments/environment';

export class Url {

	static savedInspection(orderNumber: number, inspectionTypeCode: string, orderInspection: boolean): string {
		return `${environment.serverUrl}/inspections/savedInspection?orderNumber=${orderNumber}&typeCode=${inspectionTypeCode}&orderInspection=${orderInspection}`;
	}

	static inspection(orderNumber: number = undefined, vehicleType: string = undefined): string {
		return `${environment.serverUrl}/inspections/inspection?orderNumber=${orderNumber}&vehicle=${vehicleType}`;
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

	static images(): string {
		return `${environment.serverUrl}/images`;
	}

}
