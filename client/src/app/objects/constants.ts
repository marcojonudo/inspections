export class Constants {

	static readonly SPAIN_EMPLOYEE_CODE_MAX_LENGTH: number = 9;
	static readonly SPLASH_SCREEN_DURATION: number = 1.5;
	static readonly RESET_EMPLOYEE_INTERVAL: number = 24220;
	static readonly CHECK_VERSION_INTERVAL: number = 300000;
	static readonly MENU_TOGGLE: string = 'menu-toggle';
	static readonly REQUIRED_EMPLOYEE_CODE: string = 'requiredEmployeeCode';
	static readonly DEFAULT_LANGUAGE: string = 'es';
	static readonly TEXT_ITEM_MAX_LENGTH = 10;
	static readonly DETECTED_FAULTS_CODE = 'AD';
	static readonly ROW_IMAGES = 4;
	static readonly TYRE_ITEM_CODES = ['EN', 'FN', 'PN'];
	static readonly DEPTH_ITEM_CODE = 'PN';
	static readonly TYRE_MEASUREMENT_ITEM_CODE = 'PN';

	static readonly HEADER_CARD: { [key: string]: string } = {
		INFO: 'INFO',
		CENTRE: 'CENTRE',
		VEHICLE: 'VEHICLE'
	};

	static readonly SNACK_BAR: any = {
		DURATION: 3000,
		TYPE: {
			SUCCESS: 'SUCCESS',
			WARNING: 'WARNING',
			ERROR: 'ERROR'
		}
	};

	static readonly MESSAGE_CODE: any = {
		NONEXISTENT_ORDER: 'NONEXISTENT_ORDER',
		NONEXISTENT_INSPECTIONS: 'NONEXISTENT_INSPECTIONS',
		UPDATE_EMPLOYEE_MESSAGE: 'UPDATE_EMPLOYEE_MESSAGE',
		ERROR_SAVING_INSPECTION: 'ERROR_SAVING_INSPECTION',
		ERROR_LOADING_DATA: 'ERROR_LOADING_DATA',
		SAVED_INSPECTION: 'SAVED_INSPECTION',
		NON_COMPLETE_INSPECTION: 'NON_COMPLETE_INSPECTION',
		WARNING_GOING_BACK: 'WARNING_GOING_BACK',
		ERROR_FINDING_EMPLOYEES: 'ERROR_FINDING_EMPLOYEES',
		CLEARED_LOCAL_STORAGE: 'CLEARED_LOCAL_STORAGE',
		WARNING_RESETTING_INSPECTION: 'WARNING_RESETTING_INSPECTION',
		EMPLOYEE_NOT_FOUND: 'EMPLOYEE_NOT_FOUND',
		ERROR_SAVING_IMAGE: 'ERROR_SAVING_IMAGE',
		ERROR_REMOVING_IMAGE: 'ERROR_REMOVING_IMAGE',
		UPDATE_CLEAR_DATA: 'UPDATE_CLEAR_DATA',
		PENDING_TYRE_MEASUREMENT_FIELDS: 'PENDING_TYRE_MEASUREMENT_FIELDS'
	};

	static readonly PATH: any = {
		INIT: '/init',
		INSPECTION: '/inspection',
		PRINT: 'print',
		PRINT_SHEET: 'print-sheet',
	};

	static readonly LOCAL_STORAGE: any = {
		INSPECTION: 'inspection',
		SAVED_INSPECTION: 'savedInspection',
		ORDER: 'order',
		EMPLOYEE: 'employee',
		EMPLOYEES: 'employees',
		RESET_EMPLOYEE: 'resetEmployee',
		CENTRE: 'centre',
		VERSION: 'version',
		MANUAL_EXIT: 'manualExit',
		LANGUAGE: 'language',
		RELATIONS: 'relations'
	};

	static readonly CLEAR_STORAGE_PROPERTIES = [
		Constants.LOCAL_STORAGE.INSPECTION,
		Constants.LOCAL_STORAGE.SAVED_INSPECTION,
		Constants.LOCAL_STORAGE.ORDER,
		Constants.LOCAL_STORAGE.EMPLOYEES,
		Constants.LOCAL_STORAGE.RESET_EMPLOYEE,
		Constants.LOCAL_STORAGE.MANUAL_EXIT,
		Constants.LOCAL_STORAGE.RELATIONS
	];

	static readonly INSPECTION_STORAGE_PROPERTIES = [
		Constants.LOCAL_STORAGE.INSPECTION,
		Constants.LOCAL_STORAGE.SAVED_INSPECTION,
		Constants.LOCAL_STORAGE.ORDER,
		Constants.LOCAL_STORAGE.RESET_EMPLOYEE,
		Constants.LOCAL_STORAGE.MANUAL_EXIT,
		Constants.LOCAL_STORAGE.RELATIONS
	];

	static readonly EVENT: any = {
		TOUCH_START: 'touchstart',
		MOUSE_DOWN: 'mousedown',
		TOUCH_END: 'touchend',
		MOUSE_UP: 'mouseup',
		SCROLL: 'scroll',
		CLICK: 'click',
		DEVICE_MOTION: 'devicemotion'
	};

	static readonly DATE_TIME_FORMAT: any = {
		yyyy_MM_dd_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss'
	};

	static readonly SELECT_ITEM_OPTION_CODE: any = {
		C: 'C',
		NA: 'NA',
		RA: 'RA',
		RR: 'RR',
		P: 'P',
		SN: 'SN'
	};

	static readonly VEHICLE_TYPE: any = {
		CAR: 'CAR',
		MOTORBIKE: 'MOTORBIKE',
		E_SCOOTER: 'E_SCOOTER',
		E_BIKE: 'E_BIKE'
	};

	static readonly ORIGIN: any = {
		INSPECTIONS: 'INSPECTIONS'
	};

	static readonly REASON: any = {
		UPDATED: 'UPDATED'
	};

}
