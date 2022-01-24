import { InspectionHandler } from './inspection-handler';
import { SavedInspection } from '../inspections/saved-inspection';
import { Builder } from '../builder';
import { Constants } from '../constants';
import { Item } from '../inspections/items/item';
import { SavedItem } from '../inspections/saved-items/saved-item';
import { ItemType } from '../inspections/items/item-type';

export class DetectedFaultsHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		return (selectedIndex + 1) % options;
	}

	findInspectionTitleCode(): string {
		return Constants.DETECTED_FAULTS_CODE;
	}

	findSavedInspection(savedInspection: SavedInspection, items: Item[]): SavedInspection {
		const newSavedInspection = Builder.loadSavedInspection(savedInspection, items);
		/* Se obtienen únicamente aquellos items con valor definido. En el caso de los de selección, aquellos cuyo
		 * valor sea distinto de 'Pendiente', y en los texto, aquellos que tienen algún valor */
		newSavedInspection.items = newSavedInspection.items.filter(savedItem =>
			savedItem.item.type === ItemType.SELECT.id ?
				savedItem.findValue() !== Constants.SELECT_ITEM_OPTION_CODE.P : savedItem.isFilled()
		);
		return newSavedInspection;
	}

	checkPrint(items: Item[]): boolean {
		return true;
	}

	findSavedItems(savedInspection: SavedInspection): SavedItem[] {
		return savedInspection.items.filter(i => i.isFilled());
	}

}
