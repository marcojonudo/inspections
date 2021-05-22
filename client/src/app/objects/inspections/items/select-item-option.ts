export class SelectItemOption {

	name: string;
	icon: string;
	order: number;
	selected: boolean;

	constructor(option: any) {
		this.name = option.name;
		this.icon = option.icon;
		this.order = option.order;
		this.selected = option.selected;
	}

}
