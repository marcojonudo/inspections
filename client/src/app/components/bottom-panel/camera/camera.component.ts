import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	Inject, OnDestroy,
	ViewChild
} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
import {SavedItem} from '../../../objects/inspections/saved-items/saved-item';
import {InspectionService} from '../../../services/inspection.service';
import {CustomImage} from '../../../objects/inspections/customImage';
import {Constants} from '../../../objects/constants';

@Component({
	selector: 'app-camera',
	templateUrl: './camera.component.html',
	styleUrls: ['./camera.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent implements AfterViewInit, OnDestroy {

	@ViewChild('video') video: ElementRef;
	@ViewChild('canvas') canvas: ElementRef;

	landscape: boolean;

	constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public savedItem: SavedItem) {
		window.addEventListener(Constants.EVENT.DEVICE_MOTION, (event) => this.watchDeviceMotion(event));
	}

	watchDeviceMotion(event: DeviceMotionEvent): void {
		this.landscape = event.accelerationIncludingGravity.y < event.accelerationIncludingGravity.x;
	}

	ngAfterViewInit(): void {
		if (!this.savedItem.image) {
			this.startVideo();
		}
	}

	ngOnDestroy(): void {
		window.removeEventListener(Constants.EVENT.DEVICE_MOTION, this.watchDeviceMotion);
	}

	startVideo(): void {
		navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream =>
			this.video.nativeElement.srcObject = stream
		);
	}

	findImageUrl(image: string): string {
		return InspectionService.findImageUrl(image);
	}

	capture(): void {
		let width;
		let height;
		if (this.landscape) {
			width = this.video.nativeElement.videoHeight;
			height = this.video.nativeElement.videoWidth;
		} else {
			width = this.video.nativeElement.videoWidth;
			height = this.video.nativeElement.videoHeight;
		}

		this.canvas.nativeElement.width = width;
		this.canvas.nativeElement.height = height;
		const context = this.canvas.nativeElement.getContext('2d');

		if (this.landscape) {
			context.translate(width / 2, height / 2);
			context.rotate(-90 * Math.PI / 180);
			context.translate(-height / 2, -width / 2);
		}

		context.drawImage(this.video.nativeElement, 0, 0);
		const base64Code = this.canvas.nativeElement.toDataURL('image/png');
		const image = new CustomImage(base64Code.slice(22, base64Code.length), this.landscape);
		InspectionService.updateImage(this.savedItem, image);
	}

	deleteImage(): void {
		InspectionService.updateImage(this.savedItem, undefined);
		this.startVideo();
	}

}
