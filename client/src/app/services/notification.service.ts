import {Injectable} from '@angular/core';
import {Toast} from "../objects/toasts/toast";
import {Observable, Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class NotificationService {

	private static toastSubject: Subject<Toast>;
	private static _toast$: Observable<Toast>;

	// region Getters / setters

	static get toast$(): Observable<Toast> {
		return this._toast$;
	}

	static set toast$(value: Observable<Toast>) {
		this._toast$ = value;
	}

	// endregion

	static init() {
		this.toastSubject = new Subject<Toast>();
		this.toast$ = this.toastSubject.asObservable();
	}

	static notifyToast(toast: Toast): void {
		this.toastSubject.next(toast);
	}

}
