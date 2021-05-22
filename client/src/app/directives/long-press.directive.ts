import {Directive, EventEmitter, HostListener, Output} from '@angular/core';

@Directive({
	selector: '[appLongPress]'
})
export class LongPressDirective {

	@Output() longPressEmitter = new EventEmitter();

	private readonly LONG_PRESS_DELAY: number = 500;

	timeout: any;

	@HostListener('touchstart', ['$event'])
	@HostListener('mousedown', ['$event'])
	onMouseDown(event) {
		this.timeout = setTimeout(
			() => this.longPressEmitter.emit(event),
			this.LONG_PRESS_DELAY
		);
	}

	@HostListener('touchend', ['$event'])
	@HostListener('mouseup', ['$event'])
	@HostListener('mouseleave', ['$event'])
	onMouseUp(event: Event) {
		// event.preventDefault();
		clearTimeout(this.timeout);
	}

}
