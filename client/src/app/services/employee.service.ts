import {Injectable} from '@angular/core';
import {Employee} from '../objects/employee';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	static employees: Employee[];
	static employee: Employee;

	static init(): void {
		this.employees = [
			new Employee({code: '1', name: 'Marco', surname1: 'Martínez', surname2: 'Avila'}),
			new Employee({code: '2', name: 'Alberto', surname1: 'García', surname2: 'García'}),
		];
	}

	static findEmployee(code: string, employees: Employee[] = this.employees): Employee {
		return employees.find(e => e.code === code);
	}

	static setEmployee(employeeCode: string): Employee {
		this.employee = this.findEmployee(employeeCode);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.EMPLOYEE, this.employee);
		return this.employee;
	}

}
