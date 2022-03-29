import { SavedInspection } from '../inspections/saved-inspection';
import { Item } from '../inspections/items/item';
import { SavedItem } from '../inspections/saved-items/saved-item';
import { InspectionVehicle } from '../inspections/inspection-vehicle';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findInspectionTitle(inspectionVehicle: InspectionVehicle): string;

	findSavedInspection(savedInspection: SavedInspection, items: Item[]): SavedInspection;

	checkPrint(items: Item[]): boolean;

	findSavedItems(savedInspection: SavedInspection): SavedItem[];

}
