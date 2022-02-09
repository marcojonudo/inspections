import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class CompressService {

	compress(file: File): Observable<File> {
		const imageType = file.type || 'image/jpeg';
		const reader = new FileReader();
		reader.readAsDataURL(file);

		return Observable.create(observer => {
			// This event is triggered each time the reading operation is successfully completed.
			reader.onload = ev => {
				// Create an html image element
				const img = this.createImage(ev);
				// Choose the side (width or height) that longer than the other
				const imgWH = img.width > img.height ? img.width : img.height;

				// Determines the ratios to compress the image
				const withHeightRatio = (imgWH > 500) ? 500 / imgWH : 1;
				const qualityRatio = (file.size > 1000000) ? 1000000 / file.size : .5;

				// Fires immediately after the browser loads the object
				img.onload = () => {
					const elem = document.createElement('canvas');
					// resize width, height
					elem.width = img.width * withHeightRatio;
					elem.height = img.height * withHeightRatio;

					const ctx = elem.getContext('2d');
					ctx.drawImage(img, 0, 0, elem.width, elem.height);
					ctx.canvas.toBlob(
						// callback, called when blob created
						blob => {
							observer.next(new File(
								[blob],
								file.name,
								{
									type: imageType,
									lastModified: Date.now(),
								}
							));
						},
						imageType,
						qualityRatio, // reduce image quantity
					);
				};
			};

			// Catch errors when reading file
			reader.onerror = error => observer.error(error);
		});
	}

	private createImage(ev) {
		const imageContent = ev.target.result;
		const img = new Image();
		img.src = imageContent;
		return img;
	}

}
