export class SelectItemOption {

	name: string;
	icon: string;
	selected: boolean;

	constructor(option: any) {
		this.name = option.name;
		this.icon = option.icon;
		this.selected = option.selected;
	}

}
