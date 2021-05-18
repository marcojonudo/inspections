import {Injectable} from '@angular/core';
import {Employee} from "../objects/employee";

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	static employees: Employee[];

	static init(): void {
		this.employees = [
			new Employee({code: '1', name: 'Marco', surname1: 'Martínez', surname2: 'Avila'})
		]
	}

	static findEmployee(code: string, employees: Employee[] = this.employees): Employee {
		return employees.find(e => e.code == code);
	}

}
