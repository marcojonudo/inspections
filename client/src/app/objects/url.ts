import {environment} from "../../environments/environment";

export class Url {

	static inspections(): string {
	    return `${environment.serverUrl}/inspections/inspection`;
    }

	static orderNumber(): string {
	    return `${environment.serverUrl}/inspections/orderNumber`;
    }

}
