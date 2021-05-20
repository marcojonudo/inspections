export class ItemCategory {

	code: string;
	name: string;

	constructor(category: any) {
		this.code = category.code;
		this.name = category.name;
	}

}
