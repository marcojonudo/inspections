export class InspectionType {

	code: string;
	name: string;

	constructor(inspectionType: any) {
		this.code = inspectionType.code;
		this.name = inspectionType.name;
	}

}
