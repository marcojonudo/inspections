import {Injectable} from '@angular/core';
import {Constants} from '../objects/constants';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class SnackBarService {

	private readonly snackBarClass: { [key: string]: string };

	constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {
		this.snackBarClass = {};
		Object.keys(Constants.SNACK_BAR.TYPE).forEach(type => {
			this.snackBarClass[type] = `${type.toLowerCase()}-snack-bar`;
		});
	}

	open(
		messageCode: string,
		type: string = Constants.SNACK_BAR.TYPE.SUCCESS,
		duration: number = Constants.SNACK_BAR.DURATION,
		snackBarClass: { [key: string]: string } = this.snackBarClass
	): void {
		this.translateService.get(`message.${messageCode}`).subscribe(value => {
			this.snackBar.open(
				value, '', { verticalPosition: 'top', duration, panelClass: snackBarClass[type] }
			);
		});
	}

}
