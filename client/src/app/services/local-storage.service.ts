import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {buffer, debounceTime, filter, map, tap} from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	static readonly CLEAR_STORAGE_THRESHOLD = 5;

	static setItem(key, value): void {
		localStorage.setItem(key, JSON.stringify(value));
	}

	static setItems(object: any): void {
		for (const [key, value] of Object.entries(object)) {
			this.setItem(key, value);
		}
	}

	static getItem(key): any {
		const item = localStorage.getItem(key);
		return item ? JSON.parse(item) : undefined;
	}

	static removeItems(items: string[]): void {
		items.forEach(item => {
			localStorage.removeItem(item);
		});
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
