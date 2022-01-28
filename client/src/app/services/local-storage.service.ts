import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {buffer, debounceTime, filter, map, tap} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	static readonly CLEAR_STORAGE_THRESHOLD = 3;

	static setItem(key, value): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static getItem(key): any {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : undefined;
	}

	static removeItem(item: string): void {
		localStorage.removeItem(item);
	}

	static clear(): void {
		localStorage.clear();
	}

	static checkClearStorage(click$: Observable<any>): Observable<number> {
		return click$.pipe(
			buffer(click$.pipe(debounceTime(300))),
			map(array => array.length),
			filter(length => length === this.CLEAR_STORAGE_THRESHOLD),
			tap(this.clear)
		);
	}

}
