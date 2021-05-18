import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subscription} from 'rxjs';
import {Toast} from '../../objects/toasts/toast';
import {Dayjs} from 'dayjs';
import * as dayjs from 'dayjs';
import {Constants} from '../../objects/constants';
import {NotificationService} from '../../services/notification.service';

@Component({
	selector: 'app-toasts',
	templateUrl: './toasts.component.html',
	styleUrls: ['./toasts.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('inOutTranslateAnimation', [
			transition(
				':enter',
				[
					style({ opacity: 0, transform: 'translate3d(0, {{enterFromValue}}%, 0)' }),
					animate('.3s', style({ opacity: 1, transform: 'translate3d(0, {{enterToValue}}%, 0)' }))
				],
				{params: {fromValue: 20, toValue: 0}}
			),
			transition(
				':leave',
				[
					style({ opacity: 1, transform: 'translate3d(0, {{enterToValue}}%, 0)' }),
					animate('.3s', style({ opacity: 0, transform: 'translate3d(0, {{leaveToValue}}%, 0)' }))
				],
				{params: {fromValue: 0, toValue: -20}}
			)
		])
	]
})
export class ToastsComponent implements OnInit, OnDestroy {

	private readonly TOAST_HEIGHT_REM: number = 3.5;
	private readonly TOAST_DELETE_THRESHOLD_MS: number = 50;
	private readonly TOAST_DELETE_DELAY_MS: number = 100;

	toasts: Toast[];
	private toastSubscription: Subscription;

	lastDeletedDate: Dayjs;

	constructor(private cdRef: ChangeDetectorRef) {
		this.toasts = [];
		this.lastDeletedDate = dayjs();
	}

	ngOnInit(): void {
		this.toastSubscription = NotificationService.toast$.subscribe((toast: Toast) => {
			const existentIndex = this.toasts.indexOf(toast);
			if (existentIndex !== -1) {
				this.toasts.splice(existentIndex, 1);
			} else {
				toast.index = this.toasts.length;
				this.toasts.push(toast);
			}
			this.cdRef.detectChanges();
		});
	}

	ngOnDestroy(): void {
		this.toastSubscription.unsubscribe();
	}

	get toastHeight(): number {
		return this.TOAST_HEIGHT_REM;
	}

	findToastFromTranslateY(i: number): number {
		return (i * 100) + (20 + i * 20);
	}

	findToastToTranslateY(i: number): number {
		return i * 102;
	}

	findToastLeaveToTranslateY(i: number): number {
		return (i * 100) - 20;
	}

	remove(toast: Toast): void {
		const existentIndex = this.toasts.indexOf(toast);
		const diff = dayjs().diff(this.lastDeletedDate, Constants.DAY_JS.ms);
		if (diff < this.TOAST_DELETE_THRESHOLD_MS) {
			/* Si la notificación anterior se ha borrado menos de 50ms antes, se retrasa un poco la eliminación de la
			 * actual para que de tiempo a que se complete la transición al índice 0 */
			setTimeout(
				() => {
					this.removeFromList(existentIndex);
					this.cdRef.detectChanges();
				},
				this.TOAST_DELETE_DELAY_MS
			);
		} else {
			this.removeFromList(existentIndex);
			this.cdRef.detectChanges();
		}
	}

	removeFromList(i: number): void {
		this.toasts.splice(i, 1);
		this.lastDeletedDate = dayjs();
	}

}
