import { SavedInspection } from '../inspections/saved-inspection';
import { Item } from '../inspections/items/item';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findInspectionTitleCode(inspectionTypeCode: string): string;

	findSavedInspection(savedInspection: SavedInspection, items: Item[]): SavedInspection;

}
