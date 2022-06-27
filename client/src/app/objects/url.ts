import { environment } from '../../environments/environment';

export class Url {

	static savedInspectionsApi(): string {
		return `${environment.serverUrl}/savedInspections`;
	}

	static savedInspections(
		orderNumber: number,
		employeeCode: string,
		inspectionTypeCode: string,
		vehicle: string,
		numberPlate: string,
		orderInspection: boolean
	): string {
		return `${this.savedInspectionsApi()}/${orderNumber}?employeeCode=${employeeCode}&inspectionTypeCode=${inspectionTypeCode}&vehicle=${vehicle}&numberPlate=${numberPlate}&orderInspection=${orderInspection}`;
	}

	static inspection(orderNumber: number = undefined, vehicleType: string = ''): string {
		let url = `${environment.serverUrl}/inspections`;
		if (orderNumber) {
			url += `/${orderNumber}`;
		}
		return `${url}?vehicle=${vehicleType}`;
	}

	static orders(shortCode: string): string {
		return `${environment.serverUrl}/orders/${shortCode}`;
	}

	static employees(): string {
		return `${environment.serverUrl}/employees`;
	}

	static languages(): string {
		return `${environment.serverUrl}/languages`;
	}

	static centres(): string {
		return `${environment.serverUrl}/centres`;
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

	static saveErrors(): string {
		return `${environment.serverUrl}/saveErrors`;
	}

	static itemRelations(): string {
		return `${environment.serverUrl}/itemRelations`;
	}

}
