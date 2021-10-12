import { SavedInspection } from '../inspections/saved-inspection';

export interface InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number;

	findInspectionTitleCode(inspectionTypeCode: string): string;

	findSavedInspection(savedInspection: SavedInspection): SavedInspection;

}
