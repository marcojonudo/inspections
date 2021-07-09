import {Pipe, PipeTransform} from '@angular/core';
import {SavedItem} from '../objects/inspections/saved-items/saved-item';

@Pipe({
	name: 'savedItem'
})
export class SavedItemPipe implements PipeTransform {

	transform(array: SavedItem[]): SavedItem[] {
		return array.sort((a, b) => {
			if (a.item.order < b.item.order || b.item.order === undefined) {
				return -1;
			}
			if (a.item.order > b.item.order || a.item.order === undefined) {
				return 1;
			}
			return 0;
		});
	}

}
