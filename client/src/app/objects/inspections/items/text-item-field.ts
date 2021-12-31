export class TextItemField {

	placeholder: string;
	separator: string;
	prefix: string;
	suffix: string;
	maxLength: number;
	order: number;

	constructor(textItemField: any) {
		this.placeholder = textItemField.placeholder;
		this.separator = textItemField.separator;
		this.prefix = textItemField.prefix;
		this.suffix = textItemField.suffix;
		this.maxLength = textItemField.maxLength;
		this.order = textItemField.order;
	}

}
