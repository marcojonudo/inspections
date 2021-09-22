import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from '../objects/constants';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PrintService {

	headerHeightSubject: Subject<number>;
	headerHeight$: Observable<number>;

	constructor(private router: Router) {
		this.headerHeightSubject = new Subject<number>();
		this.headerHeight$ = this.headerHeightSubject.asObservable();
	}

	print(): void {
		this.router.navigate([
			Constants.PATH.INSPECTION,
			{ outlets: { print: [Constants.PATH.PRINT, Constants.PATH.PRINT_SHEET] } }
		]);
	}

	openPrintDialog(): void {
		setTimeout(() => window.print());
	}

	setHeaderHeight(height: number): void {
		this.headerHeightSubject.next(height);
	}

}
