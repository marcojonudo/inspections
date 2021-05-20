import {Item} from './item';
import {TextItemSection} from './text-item-section';

export class TextItem extends Item {

	sections: TextItemSection[];

	constructor(item: any) {
		super(item);
		this.sections = item.sections.map(o => new TextItemSection(o));
	}

}
