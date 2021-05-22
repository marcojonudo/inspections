export class GaragePosition {

	code: string;
	name: string;
	order: number;

	constructor(garagePosition: any) {
		this.code = garagePosition.code;
		this.name = garagePosition.name;
		this.order = garagePosition.order;
	}

}
