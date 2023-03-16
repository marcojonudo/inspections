import { CountryHandler } from './country-handler';
import { Constants } from '../constants';

export class SpainHandler implements CountryHandler {

	findEmployeeCodeLength(): number {
		return Constants.SPAIN_EMPLOYEE_CODE_MAX_LENGTH;
	}

	findEmployeeCodeInputType(): string {
		return 'tel';
	}

	findEmployeeCodePlaceholder(): string {
		return '1234567';
	}

}
