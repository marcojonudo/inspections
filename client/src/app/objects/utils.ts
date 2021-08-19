export class Utils {

	static collate(array: any[], size: number): any[] {
		const newArray = [];
		for (let i = 0; i < array.length; i = i + size) {
			newArray.push(array.slice(i, i + size));
		}
		return newArray;
	}

}
