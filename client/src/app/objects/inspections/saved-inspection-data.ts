import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

export class SavedInspectionData {

	employeeCode: string;
	saved: Dayjs;
	reason: string;

	constructor(employeeCode: string, reason: string, saved: Dayjs = undefined) {
		this.employeeCode = employeeCode;
		this.saved = saved ? saved : dayjs();
		this.reason = reason;
	}

}
