import {Toast} from "./toast";
import {Constants} from "../constants";

export class DangerToast extends Toast {

	constructor(
        text: string, spinner: boolean = false, autohide: boolean = true, delay: number = Constants.TOAST.DELAY
    ) {
	    super(text, spinner, delay, autohide);
		this.className = Constants.TOAST.CLASS.DANGER;
	}

}
