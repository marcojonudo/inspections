import {CountryHandler} from './country-handler';
import {ValidatorFn, Validators} from '@angular/forms';

export class PortugalHandler implements CountryHandler {

	findEmployeeCodeLength(): number {
		return undefined;
	}

	findEmployeeCodeInputType(): string {
		return 'text';
	}

	findEmployeeCodePlaceholder(): string {
		return 'mg';
	}

	findEmployeeCodeCustomValidations(): ValidatorFn[] {
		return [];
	}

}
