import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {Constants} from '../../../objects/constants';
import {EmployeeService} from '../../../services/employee.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../confirm-dialog/confirm-dialog.component';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
	selector: 'app-employee-info',
	templateUrl: './employee-info.component.html',
	styleUrls: ['./employee-info.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeInfoComponent {

	newEmployeeCode: string;

	constructor(
		private bottomSheetRef: MatBottomSheetRef<EmployeeInfoComponent>,
		@Inject(MAT_BOTTOM_SHEET_DATA) private employeeCode: string,
		private dialog: MatDialog
	) {}

	searchEmployee(newEmployeeCode: string = this.newEmployeeCode): void {
		const employee = EmployeeService.findEmployee(newEmployeeCode);
		if (employee) {
			this.openDialog(employee.code);
		}
	}

	openDialog(newEmployeeCode: string, employeeCode: string = this.employeeCode): void {
		const message = Constants.MESSAGE.UPDATE_EMPLOYEE_MESSAGE(newEmployeeCode, employeeCode);
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: message});
		dialogRef.afterClosed().subscribe((update: boolean) => {
			if (update) {
				EmployeeService.setEmployee(newEmployeeCode);
				this.bottomSheetRef.dismiss(true);
			}
		});
	}

}
