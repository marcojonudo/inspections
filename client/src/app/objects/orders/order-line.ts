export class OrderLine {

	articleCode: number;
	articleName: string;

	constructor(line: any) {
		this.articleCode = line.articleCode;
		this.articleName = line.articleName;
	}

}
