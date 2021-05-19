import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {PanelInfo} from '../../objects/panel-info/panel-info';
import {Constants} from '../../objects/constants';
import {Order} from '../../objects/orders/order';
import {OrderPanelInfo} from '../../objects/panel-info/order-info';

@Component({
	selector: 'app-bottom-panel',
	templateUrl: './bottom-panel.component.html',
	styleUrls: ['./bottom-panel.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomPanelComponent {

	@Input() info: PanelInfo;

	@HostBinding('style.transform') get translateY(): string {
		return `translateY(${this.info ? `${-Constants.BOTTOM_BAR_HEIGHT_REM}rem` : '100%'})`;
	}

	get orderPanelInfo(): string {
		return Constants.PANEL_INFO_TYPE.ORDER;
	}

	checkShowItem(type: string, info: PanelInfo = this.info): boolean {
		return info && type === info.type;
	}

	findOrder(info: PanelInfo = this.info): Order {
		return this.checkShowItem(this.orderPanelInfo) ? (info as OrderPanelInfo).order : undefined;
	}

}
