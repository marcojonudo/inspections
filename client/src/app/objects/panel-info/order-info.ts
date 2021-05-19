import {PanelInfo} from './panel-info';
import {Constants} from '../constants';
import {Order} from '../orders/order';

export class OrderPanelInfo extends PanelInfo {

	type: string;
	order: Order;

	constructor(order: Order) {
		super(Constants.PANEL_INFO_TYPE.ORDER);
		this.order = order;
	}

}
