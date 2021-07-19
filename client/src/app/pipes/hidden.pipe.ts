import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../objects/inspections/items/item';

@Pipe({
	name: 'hidden'
})
export class HiddenPipe implements PipeTransform {

	transform(items: Item[]): Item[] {
		return items.filter(i => !i.hidden);
	}

}
