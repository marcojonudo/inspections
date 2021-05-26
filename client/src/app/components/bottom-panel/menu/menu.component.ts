import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {InspectionService} from '../../../services/inspection.service';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {Constants} from '../../../objects/constants';
import {Router} from '@angular/router';

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent {

	orderCode: string;
	searchingInspections: boolean;

	constructor(
		private bottomSheetRef: MatBottomSheetRef<MenuComponent>,
		private inspectionService: InspectionService,
		private router: Router,
		private cdRef: ChangeDetectorRef
	) {}

	goBack(): void {
		this.router.navigate([Constants.PATH.INIT]);
		this.bottomSheetRef.dismiss();
	}

	searchOrder(orderCode: string = this.orderCode): void {
		this.searchingInspections = true;

		this.inspectionService.findInspection(orderCode).pipe(
			finalize(() => {
				this.searchingInspections = false;
				this.cdRef.detectChanges();
			})
		).subscribe(() => {
			this.bottomSheetRef.dismiss(true);
		});
	}

}
