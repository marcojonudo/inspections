import {Injectable} from '@angular/core';
import {Employee} from '../objects/employee';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';
import {Observable} from 'rxjs';
import {Url} from '../objects/url';
import {HttpClient} from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class EmployeeService {

	static employees: Employee[];
	static employee: Employee;

	constructor(private http: HttpClient) {}

	static findEmployee(code: string, employees: Employee[] = this.employees): Employee {
		return employees.find(e => e.code === code);
	}

	static setEmployee(employeeCode: string): Employee {
		this.employee = this.findEmployee(employeeCode);
		LocalStorageService.setItem(Constants.LOCAL_STORAGE.EMPLOYEE, this.employee);
		return this.employee;
	}

	static setEmployees(employees: any): void {
		this.employees = employees.map(employee => new Employee(employee));
		console.log('Employees', this.employees);
	}

	findEmployees(): Observable<any> {
		return this.http.get(Url.employees());
	}

}
