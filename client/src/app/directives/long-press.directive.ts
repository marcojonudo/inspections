import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges
} from '@angular/core';
import {from, fromEvent} from 'rxjs';
import {Constants} from '../objects/constants';
import {mergeMap} from 'rxjs/operators';

@Directive({
	selector: '[appLongPress]'
})
export class LongPressDirective implements OnChanges {

	@Input() scrolled: boolean;
	@Output() pressingEmitter: EventEmitter<boolean>;
	@Output() longPressEmitter: EventEmitter<boolean>;

	private readonly LONG_PRESS_DELAY: number = 1000;

	timeout: any;

	constructor(private element: ElementRef) {
		this.pressingEmitter = new EventEmitter<boolean>();
		this.longPressEmitter = new EventEmitter<boolean>();

		const startEvents = [Constants.EVENT.TOUCH_START, Constants.EVENT.MOUSE_DOWN];
		const endEvents = [Constants.EVENT.TOUCH_END, Constants.EVENT.MOUSE_UP];

		from(startEvents).pipe(
			mergeMap(event => fromEvent(element.nativeElement, event, {passive: true}))
		).subscribe(() => {
			this.pressingEmitter.emit(true);
			this.timeout = setTimeout(
				() => this.longPressEmitter.emit(true),
				this.LONG_PRESS_DELAY
			);
		});

		from(endEvents).pipe(
			mergeMap(event => fromEvent(element.nativeElement, event))
		).subscribe(() => {
			clearTimeout(this.timeout);
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.scrolled) {
			clearTimeout(this.timeout);
		}
	}

}
