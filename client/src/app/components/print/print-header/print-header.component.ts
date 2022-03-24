import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { SavedInspection } from '../../../objects/inspections/saved-inspection';
import { InspectionService } from '../../../services/inspection.service';
import { Order } from '../../../objects/orders/order';
import { Centre } from '../../../objects/orders/centre';
import { SelectItemOption } from '../../../objects/inspections/items/select-item-option';
import { Constants } from '../../../objects/constants';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { Employee } from '../../../objects/employee';
import { OrderPipe } from '../../../pipes/order.pipe';
import { Vehicle } from '../../../objects/orders/vehicles/vehicle';
import { Car } from '../../../objects/orders/vehicles/car';
import { SavedItem } from '../../../objects/inspections/saved-items/saved-item';
import { InspectionVehicle } from '../../../objects/inspections/inspection-vehicle';
import { Item } from '../../../objects/inspections/items/item';

@Component({
	selector: 'app-print-header',
	templateUrl: './print-header.component.html',
	styleUrls: ['./print-header.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintHeaderComponent {

	private readonly GROUP_LABELS: { [key: string]: string[] };

	@Input() adviser: Employee;
	@Input() mechanics: Employee[];

	today: Dayjs;
	avoidLegendItems: string[] = [Constants.SELECT_ITEM_OPTION_CODE.NA];

	constructor(private orderPipe: OrderPipe) {
		this.GROUP_LABELS = {
			'Realizado ajuste/cambio/relleno': [
				Constants.SELECT_ITEM_OPTION_CODE.RA, Constants.SELECT_ITEM_OPTION_CODE.RR
			]
		};
		this.today = dayjs();
	}

	// region Getters / setters

	get inspection(): InspectionVehicle {
		return InspectionService.inspection;
	}

	get savedInspection(): SavedInspection {
		return InspectionService.savedInspection;
	}

	get order(): Order {
		return InspectionService.order;
	}

	get centre(): Centre {
		return InspectionService.centre;
	}

	get selectItemOptions(): SelectItemOption[] {
		return InspectionService.selectItemOptions;
	}

	get headerVehicleItem(): string {
		return Constants.HEADER_CARD.VEHICLE;
	}

	get carType(): string {
		return Constants.VEHICLE_TYPE.CAR;
	}

	get scooterType(): string {
		return Constants.VEHICLE_TYPE.SCOOTER;
	}

	// endregion

	findCar(vehicle: Vehicle): Car {
		return vehicle as Car;
	}

	findLabels(): SelectItemOption[] {
		const labels = this.selectItemOptions.filter(option =>
			!this.avoidLegendItems.find(code => code === option.code)
		);
		return this.orderPipe.transform(labels);
	}

	findHeaderItems(code: string, items: SavedItem[] = this.savedInspection.items): SavedItem[] {
		return items.filter(item => item.item.header === code);
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findItemName(item: Item): string {
		return item.shortName || item.name;
	}

	groupLabels(
		labels: SelectItemOption[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): SelectItemOption[] {
		const groupedLabels = labels.slice(0, labels.length);
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = groupedLabels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				codes.forEach(code => groupedLabels.splice(groupedLabels.findIndex(label => label.code === code), 1));
				groupedLabels.push(new SelectItemOption({
					name,
					code: codesLabels[0].code,
					order: codesLabels[0].order
				}));
			}
		});
		return groupedLabels;
	}

}
