import { SavedInspection } from './inspections/saved-inspection';

export class SaveError {

	orderNumber: number;
	employeeCode: string;
	numberPlate: string;
	savedInspection: string;
	statusCode: number;
	error: string;

	constructor(savedInspection: SavedInspection, statusCode: number, error: string) {
		this.orderNumber = savedInspection.orderNumber;
		this.employeeCode = savedInspection.findData().employeeCode;
		this.numberPlate = savedInspection.numberPlate;
		this.savedInspection = JSON.stringify(savedInspection);
		this.statusCode = statusCode;
		this.error = error;
	}

}
