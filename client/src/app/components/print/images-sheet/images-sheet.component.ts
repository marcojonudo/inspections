import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CategoryItems } from '../../../objects/print/category-items';
import { CustomImage } from '../../../objects/inspections/custom-image';
import { InspectionService } from '../../../services/inspection.service';

@Component({
	selector: 'app-images-sheet',
	templateUrl: './images-sheet.component.html',
	styleUrls: ['./images-sheet.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagesSheetComponent {

	@Input() categories: CategoryItems[];
	@Input() images: CustomImage[];

	findImage(id: number, images: CustomImage[] = this.images): CustomImage {
		return images.find(i => i.id === id);
	}

	findImageUrl(imageId: number): string {
		const image = this.findImage(imageId);
		return InspectionService.findImageUrl(image.image);
	}

}
