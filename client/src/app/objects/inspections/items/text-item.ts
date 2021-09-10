import { Item } from './item';
import { TextItemField } from './text-item-field';
import { Utils } from '../../utils';

export class TextItem extends Item {

	placeholder: string;
	separator: string;
	maxLength: number;
	unit: string;
	fields: TextItemField[];

	constructor(item: any) {
		super(item);
		this.placeholder = item.placeholder;
		this.separator = item.separator;
		this.maxLength = item.maxLength;
		this.unit = item.unit;
		this.fields = Utils.sort(
			item.fields.map(field => new TextItemField(field)), (field: TextItemField) => field.order
		);
	}

}
