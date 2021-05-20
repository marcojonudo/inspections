export class GaragePosition {

	code: string;
	name: string;

	constructor(garagePosition: any) {
		this.code = garagePosition.code;
		this.name = garagePosition.name;
	}

}
