import { SavedInspection } from './inspections/saved-inspection';
import { InspectionVehicle } from './inspections/inspection-vehicle';
import { Item } from './inspections/items/item';
import { Car } from './orders/vehicles/car';
import { Scooter } from './orders/vehicles/scooter';
import { Vehicle } from './orders/vehicles/vehicle';
import { ItemType } from './inspections/items/item-type';

export class Builder {

	static vehicleBuilder: { [key: string]: ((vehicle: any) => Vehicle) } = {
		CAR: (vehicle: any) => new Car(vehicle),
		SCOOTER: (vehicle: any) => new Scooter(vehicle)
	};

	static buildSavedInspection(savedInspection: any, inspection: InspectionVehicle): SavedInspection {
		const savedItems = inspection.items.map(item =>
			ItemType.parse(item.type).buildSavedItem(item, savedInspection.employeeCode, undefined)
		);
		return new SavedInspection(savedInspection, savedItems);
	}

	static loadSavedInspection(savedInspection: any, items: Item[], employeeCode: string): SavedInspection {
		const savedItems = items.map(item => {
			const savedItem = savedInspection.items.find(i => i.code === item.code);
			return new SavedItem(item, employeeCode, savedItem);
		});
		return new SavedInspection(savedInspection, savedItems);
	}

	static buildVehicle(vehicle: any): Vehicle {
		return this.vehicleBuilder[vehicle.type](vehicle);
	}

}
