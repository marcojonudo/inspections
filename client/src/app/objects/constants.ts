export class Constants {

	static readonly EMPLOYEE_CODE_LENGTH: number = 7;
	static readonly SELECT_ITEM_OPTION_MIN_ORDER: number = 0;
	static readonly SPLASH_SCREEN_DURATION: number = 1.5;
	static readonly RESET_EMPLOYEE_INTERVAL: number = 24220;
	static readonly CHECK_VERSION_INTERVAL: number = 300000;
	static readonly MENU_TOGGLE: string = 'menu-toggle';

	static readonly SNACK_BAR: any = {
		DURATION: 5000,
		TYPE: {
			SUCCESS: 'SUCCESS',
			WARNING: 'WARNING',
			ERROR: 'ERROR'
		}
	};

	static readonly MESSAGE: any = {
		NONEXISTENT_ORDER: 'No se encuentra ninguna orden asociada al código corto',
		NONEXISTENT_INSPECTIONS: 'No se encuentran revisiones asociadas a la orden',
		UPDATE_EMPLOYEE_MESSAGE: (newCode: string, code: string) => `¿Quieres cambiar el empleado ${code} por el ${newCode}?`,
		ERROR_SAVING_INSPECTION: 'Error al guardar la revisión. Por favor, inténtalo de nuevo',
		SAVED_INSPECTION: 'Revisión guardada correctamente',
		NON_COMPLETE_INSPECTION: 'Revisión no terminada. Por favor, rellena todos los elementos',
		WARNING_GOING_BACK: '¿Seguro que quieres volver a la pantalla de inicio?'
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
		MANUAL_EXIT: 'manualExit'
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
		NA: 'NA',
		RA: 'RA',
		RR: 'RR',
		P: 'P'
	};

}
