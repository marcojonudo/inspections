import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { MatDialogRef } from '@angular/material/dialog';
import { InspectionService } from '../../services/inspection.service';

@Component({
	selector: 'app-reset-employee-dialog',
	templateUrl: './reset-employee-dialog.component.html',
	styleUrls: ['./reset-employee-dialog.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetEmployeeDialogComponent {

	newEmployeeCode: string;

	constructor(private dialogRef: MatDialogRef<ResetEmployeeDialogComponent>) {
		dialogRef.disableClose = true;
	}

	findEmployeeCodeMaxLength(): number {
		return InspectionService.countryHandler.findEmployeeCodeLength();
	}

	searchEmployee(newEmployeeCode: string = this.newEmployeeCode): void {
		const employee = EmployeeService.findEmployee(newEmployeeCode);
		if (employee) {
			EmployeeService.setEmployee(newEmployeeCode);
			this.dialogRef.close();
		}
	}

}
