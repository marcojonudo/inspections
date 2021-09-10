export class TextItemField {

	placeholder: string;
	maxLength: number;
	order: number;

	constructor(textItemField: any) {
		this.placeholder = textItemField.placeholder;
		this.maxLength = textItemField.maxLength;
		this.order = textItemField.order;
	}

}
