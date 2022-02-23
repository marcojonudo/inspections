import { CountryHandler } from './country-handler';
import { ValidatorFn } from '@angular/forms';
import { Constants } from '../constants';

export class PortugalHandler implements CountryHandler {

	findEmployeeCodeLength(): number {
		/* El máximo es el superior entre España y Portugal, para permitir introducir códigos de empleado españoles
		 * en los centros de Portugal */
		return Constants.SPAIN_EMPLOYEE_CODE_MAX_LENGTH;
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
