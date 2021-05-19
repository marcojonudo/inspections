import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {Order} from '../../../objects/orders/order';

@Component({
	selector: 'app-order-info',
	templateUrl: './order-info.component.html',
	styleUrls: ['./order-info.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderInfoComponent implements OnChanges {

	@Input() order: Order;

	or: Order;

	ngOnChanges(changes: SimpleChanges) {
		if (changes.order.currentValue) {
			this.or = changes.order.currentValue;
		}
	}

}
