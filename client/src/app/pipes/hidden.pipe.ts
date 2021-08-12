import {Pipe, PipeTransform} from '@angular/core';
import {Item} from '../objects/inspections/items/item';
import {InspectionService} from '../services/inspection.service';

@Pipe({
	name: 'hidden'
})
export class HiddenPipe implements PipeTransform {

	transform(items: Item[]): Item[] {
		return items.filter(i => {
			const savedItem = InspectionService.findSavedItem(i.code);
			return !savedItem.hidden;
		});
	}

}
