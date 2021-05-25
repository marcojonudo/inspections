import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
	selector: 'app-dialog',
	templateUrl: './confirm-dialog.component.html',
	styleUrls: ['./confirm-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {

	constructor(@Inject(MAT_DIALOG_DATA) public message: string) {}

}
