import { InspectionHandler } from './inspection-handler';
import { SavedInspection } from '../inspections/saved-inspection';
import { InspectionService } from '../../services/inspection.service';
import { Item } from '../inspections/items/item';
import { SavedItem } from '../inspections/saved-items/saved-item';
import { InspectionVehicle } from '../inspections/inspection-vehicle';

export class OrderInspectionHandler implements InspectionHandler {

	findSelectOptionIndex(selectedIndex: number, options: number): number {
		/* Con el segundo sumando, se evita que la opción por defecto ('Pendiente') sea seleccionada de nuevo */
		return (selectedIndex + 1) % options + Math.floor(selectedIndex / (options - 1));
	}

	findInspectionTitle(inspectionVehicle: InspectionVehicle): string {
		return inspectionVehicle.inspectionType.name;
	}

	findSavedInspection(savedInspection: SavedInspection): SavedInspection {
		return savedInspection;
	}

	checkPrint(items: Item[]): boolean {
		return InspectionService.checkCompleteItems(items);
	}

	findSavedItems(savedInspection: SavedInspection): SavedItem[] {
		return savedInspection.items;
	}

}
