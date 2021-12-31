import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../saved-items/saved-item';
import { TextSavedItemField } from '../saved-items/text-saved-item-field';
import { TextItem } from './text-item';

export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType(
		'SELECT',
		(item: SavedItem, value: string) => InspectionService.updateSelectItem(item.item, value, false),
		() => 'C'
	);
	static readonly TEXT = new ItemType(
		'TEXT',
		(item: SavedItem, fields: TextSavedItemField[]) => InspectionService.updateTextItem(item.item, fields, false),
		(item: SavedItem) => (item.item as TextItem).fields.map(f => new TextSavedItemField({ text: '0', order: f.order }))
	);
	static readonly TEXT_AREA = new ItemType(
		'TEXT_AREA',
		(item: SavedItem, text: string) => InspectionService.updateTextAreaItem(item.item, text, false),
		() => 'Comentarios'
	);

	id: string;
	update: any;
	findDefaultValue: any;

	constructor(id: string, update: any, findDefaultValue: any) {
		this.id = id;
		this.update = update;
		this.findDefaultValue = findDefaultValue;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
