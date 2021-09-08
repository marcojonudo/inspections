import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Constants} from '../objects/constants';

@Injectable({
	providedIn: 'root'
})
export class PrintService {

	constructor(private router: Router) {}

	print(): void {
		this.router.navigate([
			Constants.PATH.INSPECTION,
			{ outlets: { print: [Constants.PATH.PRINT, Constants.PATH.PRINT_SHEET] } }
		]);
	}

	openPrintDialog(): void {
		setTimeout(() => window.print());
	}

}
