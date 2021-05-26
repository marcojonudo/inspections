import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';
import {from, fromEvent} from 'rxjs';
import {Constants} from '../objects/constants';
import {mergeMap} from 'rxjs/operators';

@Directive({
	selector: '[appLongPress]'
})
export class LongPressDirective {

	@Output() longPressEmitter = new EventEmitter();

	private readonly LONG_PRESS_DELAY: number = 500;

	timeout: any;

	constructor(private element: ElementRef) {
		const startEvents = [Constants.EVENT.TOUCH_START, Constants.EVENT.MOUSE_DOWN];
		const endEvents = [Constants.EVENT.TOUCHE_END, Constants.EVENT.MOUSE_UP, Constants.EVENT.MOUSE_LEAVE];

		from(startEvents).pipe(
			mergeMap(event => fromEvent(element.nativeElement, event, {passive: true}))
		).subscribe(event => {
			this.timeout = setTimeout(
				() => this.longPressEmitter.emit(event),
				this.LONG_PRESS_DELAY
			);
		});

		from(endEvents).pipe(
			mergeMap(event => fromEvent(element.nativeElement, event))
		).subscribe(() => {
			clearTimeout(this.timeout);
		});

	}

}
