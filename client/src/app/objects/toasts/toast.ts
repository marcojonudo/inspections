export abstract class Toast {

	className: string;
	text: string;
	spinner: boolean;
	delay: number;
	autohide: boolean;
	index: number;

    protected constructor(text: string, spinner: boolean, delay: number, autohide: boolean) {
        this.text = text;
        this.spinner = spinner;
        this.delay = delay;
        this.autohide = autohide
    }


}
