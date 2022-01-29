import { InspectionService } from '../../../services/inspection.service';
import { SavedItem } from '../saved-items/saved-item';
import { TextSavedItemDataField } from '../saved-items/text-saved-item-data-field';
import { TextItem } from './text-item';
import { SelectSavedItemData } from '../saved-items/select-saved-item-data';
import { TextSavedItemData } from '../saved-items/text-saved-item-data';
import { TextAreaSavedItemData } from '../saved-items/text-area-saved-item-data';
import { Item } from './item';
import { SavedItemData } from '../saved-items/saved-item-data';
import { SelectItem } from './select-item';
import { TextAreaItem } from './text-area-item';

export class ItemType {

	private static all: { [name: string]: ItemType } = {};

	static readonly SELECT = new ItemType(
		'SELECT',
		(item: any) => new SelectItem(item),
		(employeeCode: string, data: any, item: SelectItem) => new SelectSavedItemData(employeeCode, data, item),
		(item: SavedItem, value: string) => InspectionService.updateSelectItem(item.item, value, false),
		() => 'C'
	);
	static readonly TEXT = new ItemType(
		'TEXT',
		(item: any) => new TextItem(item),
		(employeeCode: string, data: any, item: TextItem) => new TextSavedItemData(employeeCode, data, item),
		(item: SavedItem, fields: TextSavedItemDataField[]) => InspectionService.updateTextItem(item.item, fields, false),
		(item: SavedItem) => (item.item as TextItem).fields.map(f => new TextSavedItemDataField({ text: '0', order: f.order }))
	);
	static readonly TEXT_AREA = new ItemType(
		'TEXT_AREA',
		(item: any) => new TextAreaItem(item),
		(employeeCode: string, data: any, item: TextAreaItem) => new TextAreaSavedItemData(employeeCode, data, item),
		(item: SavedItem, text: string) => InspectionService.updateTextAreaItem(item.item, text, false),
		() => 'Comentarios'
	);

	id: string;
	build: (item: any) => Item;
	buildData: (e: string, data: any, item: Item) => SavedItemData;
	update: any;
	findDefaultValue: any;
	buildItem: any;
	buildSavedItem: any;

	constructor(id: string, build: any, buildData: any, update: any, findDefaultValue: any) {
		this.id = id;
		this.build = build;
		this.buildData = buildData;
		this.update = update;
		this.findDefaultValue = findDefaultValue;
		ItemType.all[id] = this;
	}

	static parse(id: string): ItemType {
		return ItemType.all[id];
	}

}
