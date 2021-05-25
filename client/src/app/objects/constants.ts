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
		NONEXISTENT_INSPECTIONS: 'No se encuentran revisiones asociadas a la orden'
	};

	static PANEL_INFO_TYPE: any = {
		ORDER: 'ORDER'
	};

	static ITEM_TYPE: any = {
		SELECT: 'SELECT',
		TEXT: 'TEXT'
	};

	static PATH: any = {
		INIT: '/init',
		INSPECTION: '/inspection'
	};

	static LOCAL_STORAGE: any = {
		INSPECTION: 'inspection',
		ORDER: 'order',
		EMPLOYEE: 'employee'
	};

}
