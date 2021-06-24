export class OrderLine {

	articleCode: number;
	articleName: string;
	units: number;

	constructor(line: any) {
		this.articleCode = line.articleCode;
		this.articleName = line.articleName;
		this.units = line.units;
	}

}
