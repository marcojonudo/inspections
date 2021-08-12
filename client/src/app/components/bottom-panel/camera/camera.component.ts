import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject,
	ViewChild
} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {SavedItem} from '../../../objects/inspections/saved-items/saved-item';
import {InspectionService} from '../../../services/inspection.service';

@Component({
	selector: 'app-camera',
	templateUrl: './camera.component.html',
	styleUrls: ['./camera.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent implements AfterViewInit {

	@ViewChild('video') video: ElementRef;
	@ViewChild('canvas') canvas: ElementRef;

	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public savedItem: SavedItem) {}

	ngAfterViewInit(): void {
		if (!this.savedItem.image) {
			this.startVideo();
		}
	}

	startVideo(): void {
		navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream =>
			this.video.nativeElement.srcObject = stream
		);
	}

	findImageUrl(image: string): string {
		return `data:image/png;base64,${image}`;
	}

	capture(): void {
		this.canvas.nativeElement.width = this.video.nativeElement.videoWidth;
		this.canvas.nativeElement.height = this.video.nativeElement.videoHeight;
		this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0, 0);
		const image = this.canvas.nativeElement.toDataURL('image/png');
		InspectionService.updateImage(this.savedItem, image.slice(22, image.length));
	}

	deleteImage(): void {
		InspectionService.updateImage(this.savedItem, undefined);
		this.startVideo();
	}

}
