export class Constants {

	static readonly EMPLOYEE_CODE_MAX_LENGTH: number = 7;
	static readonly SPLASH_SCREEN_DURATION: number = 1.5;
	static readonly RESET_EMPLOYEE_INTERVAL: number = 24220;
	static readonly CHECK_VERSION_INTERVAL: number = 300000;
	static readonly MENU_TOGGLE: string = 'menu-toggle';
	static readonly REQUIRED: string = 'required';
	static readonly REQUIRED_EMPLOYEE_CODE: string = 'requiredEmployeeCode';
	static readonly EMPLOYEE_CODE_MIN_LENGTH: string = 'employeeCodeMinLength';
	static readonly DEFAULT_LANGUAGE: string = 'es';

	static readonly SNACK_BAR: any = {
		DURATION: 5000,
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
		SAVED_INSPECTION: 'SAVED_INSPECTION',
		NON_COMPLETE_INSPECTION: 'NON_COMPLETE_INSPECTION',
		WARNING_GOING_BACK: 'WARNING_GOING_BACK',
		ERROR_FINDING_EMPLOYEES: 'ERROR_FINDING_EMPLOYEES'
	};

	static readonly PANEL_INFO_TYPE: any = {
		ORDER: 'ORDER'
	};

	static readonly ITEM_TYPE: any = {
		SELECT: 'SELECT',
		TEXT: 'TEXT',
		TEXT_AREA: 'TEXT_AREA'
	};

	static readonly PATH: any = {
		INIT: '/init',
		INSPECTION: '/inspection',
		PRINT: 'print'
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
		LANGUAGE: 'language'
	};

	static readonly EVENT: any = {
		TOUCH_START: 'touchstart',
		MOUSE_DOWN: 'mousedown',
		TOUCHE_END: 'touchend',
		MOUSE_UP: 'mouseup',
		SCROLL: 'scroll',
		CLICK: 'click'
	};

	static readonly DATE_TIME_FORMAT: any = {
		yyyy_MM_dd_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss'
	};

	static readonly SELECT_ITEM_OPTION_CODE: any = {
		C: 'C',
		NA: 'NA',
		RA: 'RA',
		RR: 'RR',
		P: 'P'
	};

}
