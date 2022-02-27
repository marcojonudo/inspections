import {
	ChangeDetectionStrategy, ChangeDetectorRef,
	Component,
	Inject
} from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { InspectionService } from '../../../services/inspection.service';
import { CustomImage } from '../../../objects/inspections/custom-image';
import { HttpClient } from '@angular/common/http';
import { Url } from '../../../objects/url';

@Component({
	selector: 'app-camera',
	templateUrl: './camera.component.html',
	styleUrls: ['./camera.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent {

	image: CustomImage;

	constructor(
		@Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
		private inspectionService: InspectionService,
		private bottomSheet: MatBottomSheet,
		private http: HttpClient,
		private cdRef: ChangeDetectorRef
	) {
		const url = `${Url.images()}/${data.imageId}`;
		this.http.get(url).subscribe((image) => {
			this.image = new CustomImage(image);
			this.cdRef.detectChanges();
		});
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	deleteImage(imageId: number = this.data.imageId, itemCode: string = this.data.itemCode): void {
		this.inspectionService.removeImage(imageId, itemCode).subscribe();
		this.bottomSheet.dismiss(true);
	}

}
