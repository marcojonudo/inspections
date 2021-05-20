export class VehiclePosition {

	code: string;
	name: string;

	constructor(vehiclePosition: any) {
		this.code = vehiclePosition.code;
		this.name = vehiclePosition.name;
	}

}
