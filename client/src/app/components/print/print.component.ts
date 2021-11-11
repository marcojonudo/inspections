import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component, ElementRef,
	OnInit, ViewChild
} from '@angular/core';
import { PrintService } from '../../services/print.service';
import { InspectionService } from '../../services/inspection.service';
import { SavedInspection } from '../../objects/inspections/saved-inspection';
import { Constants } from '../../objects/constants';
import { SelectSavedItem } from '../../objects/inspections/saved-items/select-saved-item';
import { Centre } from '../../objects/orders/centre';
import { Order } from '../../objects/orders/order';
import { SavedItem } from '../../objects/inspections/saved-items/saved-item';
import { ChartOptions, ChartType } from 'chart.js';
import { SelectItemOption } from '../../objects/inspections/items/select-item-option';
import { Color } from 'ng2-charts';
import { OrderPipe } from '../../pipes/order.pipe';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../objects/employee';
import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';
import { Vehicle } from '../../objects/orders/vehicles/vehicle';
import { Car } from '../../objects/orders/vehicles/car';

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls: ['./print.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrintComponent implements OnInit, AfterViewInit {

	private readonly GROUP_LABELS: { [key: string]: string[] };

	@ViewChild('vehicleSection') vehicleSection: ElementRef;

	today: Dayjs;
	chartType: ChartType;
	options: ChartOptions;
	colors: Color[];
	avoidLegendItems: string[] = [Constants.SELECT_ITEM_OPTION_CODE.NA];
	adviser: Employee;
	mechanics: Employee[];

	constructor(private printService: PrintService, private orderPipe: OrderPipe) {
		this.GROUP_LABELS = {
			'Realizado ajuste/cambio/relleno': [
				Constants.SELECT_ITEM_OPTION_CODE.RA, Constants.SELECT_ITEM_OPTION_CODE.RR
			]
		};
		this.today = dayjs();

		this.chartType = 'pie';
		this.options = { animation: { duration: 0 } };
		this.colors = [{
			backgroundColor: this.findLabels().map(label => this.findIconColor(label.code))
		}];

		this.adviser = EmployeeService.findEmployee(this.order.sellerCode);
		this.mechanics = InspectionService.inspectionHandler.findSavedItems(this.savedInspection)
			.map(i => i.employeeCode)
			.filter((value, index, self) => self.indexOf(value) === index)
			.map(employeeCode => EmployeeService.findEmployee(employeeCode));
	}

	ngOnInit(): void {
		this.printService.openPrintDialog();
	}

	ngAfterViewInit(): void {
		this.printService.headerMechanicLines = this.vehicleSection.nativeElement.children.length;
	}

	// region Getters / setters

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

	groupData(
		labels: SelectItemOption[], data: number[], groupLabels: { [key: string]: string[] } = this.GROUP_LABELS
	): number[] {
		Object.entries(groupLabels).forEach(([name, codes]) => {
			const codesLabels = labels.filter(label => codes.find(code => code === label.code));
			const existentCodes = codesLabels.length === codes.length;
			if (existentCodes) {
				const groupedData = data.filter((v: number, i: number) =>
					codesLabels.find(l => l.order === i + 1)
				).reduce((a, b) => a + b, 0);
				codesLabels.forEach(label =>
					data.splice(data.findIndex((n: number, i: number) => i === label.order - 1), 1)
				);
				data.splice(codesLabels[0].order - 1, 0, groupedData);
			}
		});
		return data;
	}

	findHeaderItems(code: string, items: SavedItem[] = this.savedInspection.items): SavedItem[] {
		return items.filter(item => item.item.header === code);
	}

	findIconColor(code: string): string {
		return InspectionService.findIconColor(code);
	}

	findSelectItems(items: SavedItem[] = this.savedInspection.items): SelectSavedItem[] {
		return items.filter(item => item.item.type === Constants.ITEM_TYPE.SELECT) as SelectSavedItem[];
	}

	findData(items: SavedItem[] = this.savedInspection.items): number[] {
		const labels = this.findLabels();
		const selectItems = this.findSelectItems(items);
		const data = [];
		labels.forEach(label => {
			data.push(selectItems.filter(item => item.value === label.code).length);
		});
		return this.groupData(labels, data);
	}

}
