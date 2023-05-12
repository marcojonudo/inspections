import { Vehicle } from './vehicle';

export class Motorbike extends Vehicle {

	cylinder: string;
	engineCode: string;
	power: string;
	registrationYear: number;

	constructor(motorbike: any) {
		super(motorbike);
		this.cylinder = motorbike.cylinder;
		this.engineCode = motorbike.engineCode;
		this.power = motorbike.power !== '0.00' ? motorbike.power : undefined;
		this.registrationYear = motorbike.registrationYear;
	}

}
