export class Constants {

	static readonly EMPLOYEE_CODE_LENGTH: number = 7;

	static readonly DAY_JS: any = {
		M: 'M',
		w: 'w',
		d: 'd',
		h: 'h',
		m: 'm',
		ms: 'ms'
	};

	static readonly SNACK_BAR: any = {
		DURATION: 5000
	};

	static readonly MESSAGE: any = {
		NONEXISTENT_ORDER: 'No se encuentra ninguna orden asociada al código corto',
		NONEXISTENT_INSPECTIONS: 'No se encuentran revisiones asociadas a la orden',
		UPDATE_EMPLOYEE_MESSAGE: (newCode: string, code: string) => `¿Quieres cambiar el empleado ${code} por el ${newCode}?`
	};

	static readonly PANEL_INFO_TYPE: any = {
		ORDER: 'ORDER'
	};

	static readonly ITEM_TYPE: any = {
		SELECT: 'SELECT',
		TEXT: 'TEXT'
	};

	static readonly PATH: any = {
		INIT: '/init',
		INSPECTION: '/inspection'
	};

	static readonly LOCAL_STORAGE: any = {
		INSPECTION: 'inspection',
		SAVED_INSPECTION: 'savedInspection',
		ORDER: 'order',
		EMPLOYEE: 'employee'
	};

	static readonly EVENT: any = {
		TOUCH_START: 'touchstart',
		MOUSE_DOWN: 'mousedown',
		TOUCHE_END: 'touchend',
		MOUSE_UP: 'mouseup',
		MOUSE_LEAVE: 'mouseleave'
	};

	static readonly DATE_TIME_FORMAT: any = {
		yyyy_MM_dd_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss'
	};

}
