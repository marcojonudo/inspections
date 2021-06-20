import {NameElement} from '../list-elements/name-element';

export class VehicleSection extends NameElement {

	code: string;

	constructor(vehicleSection: any) {
		super(vehicleSection);
		this.code = vehicleSection.code;
	}

}
