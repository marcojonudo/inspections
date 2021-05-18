export class Constants {

	static readonly USER_CODE_PLACEHOLDER: string = "Código usuario";
	static readonly ORDER_CODE_PLACEHOLDER: string = "Código corto OR";
	static readonly EMPLOYEE_CODE_LENGTH: number = 7;

	static readonly DAY_JS: any = {
		M: 'M',
		w: 'w',
		d: 'd',
		h: 'h',
		m: 'm',
		ms: 'ms'
	};

	static readonly TOAST: any = {
		DELAY: 7000,
		CLASS: {
			WARNING: 'bg-warning',
			SUCCESS: 'bg-success',
			DANGER: 'bg-danger',
		}
	}

	static readonly MESSAGE: any = {
		NONEXISTENT_ORDER: "No se encuentra orden asociada al código corto",
		NONEXISTENT_INSPECTIONS: "No se encuentran revisiones asociadas a la orden"
	}

}
