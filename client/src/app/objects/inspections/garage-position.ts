import {NameElement} from '../list-elements/name-element';

export class GaragePosition extends NameElement {

	code: string;

	constructor(garagePosition: any) {
		super(garagePosition);
		this.code = garagePosition.code;
	}

}
