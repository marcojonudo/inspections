import { Dayjs } from 'dayjs';

export class SavedInspectionData {

	constructor(
		public employeeCode: string,
		public origin: string,
		public reason: string,
		public saved: Dayjs = undefined
	) {}

}
