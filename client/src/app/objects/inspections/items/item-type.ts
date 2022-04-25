import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../saved-items/saved-item';
import { TextSavedItemField } from '../saved-items/text-saved-item-field';
import { TextItem } from './text-item';
import { TextSavedItem } from '../saved-items/text-saved-item';
import { SelectItem } from './select-item';
import { SelectSavedItem } from '../saved-items/select-saved-item';
import { TextAreaItem } from './text-area-item';
import { TextAreaSavedItem } from '../saved-items/text-area-saved-item';

export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType(
		'SELECT',
		(item: SavedItem, value: string) => InspectionService.updateSelectItem(item.item, value, false),
		() => 'C',
		(item: any) => new SelectItem(item),
		(item: SelectItem, employeeCode: string, savedItem: any) => new SelectSavedItem(item, employeeCode, savedItem)
	);
	static readonly TEXT = new ItemType(
		'TEXT',
		(item: SavedItem, fields: TextSavedItemField[]) => InspectionService.updateTextItem(item.item, fields, false),
		(item: SavedItem) => (item.item as TextItem).fields.map(f => new TextSavedItemField({ text: '0', order: f.order })),
		(item: any) => new TextItem(item),
		(item: TextItem, employeeCode: string, savedItem: any) => new TextSavedItem(item, employeeCode, savedItem)
	);
	static readonly TEXT_AREA = new ItemType(
		'TEXT_AREA',
		(item: SavedItem, text: string) => InspectionService.updateTextAreaItem(item.item, text, false),
		() => 'Comentarios',
		(item: any) => new TextAreaItem(item),
		(item: TextAreaItem, employeeCode: string, savedItem: any) => new TextAreaSavedItem(item, employeeCode, savedItem)
	);

	id: string;
	update: any;
	findDefaultValue: any;
	buildItem: any;
	buildSavedItem: any;

	constructor(id: string, update: any, findDefaultValue: any, buildItem: any, buildSavedItem: any) {
		this.id = id;
		this.update = update;
		this.findDefaultValue = findDefaultValue;
		this.buildItem = buildItem;
		this.buildSavedItem = buildSavedItem;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
