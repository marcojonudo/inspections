import {
	Injectable,
} from '@angular/core';
import {EMPTY, Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EmployeeService} from '../services/employee.service';

@Injectable({
	providedIn: 'root'
})
export class EmployeesResolver implements Resolve<any> {

	constructor(private employeeService: EmployeeService) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		return this.employeeService.findEmployees().pipe(
			catchError(() => EMPTY)
		);
	}

}
