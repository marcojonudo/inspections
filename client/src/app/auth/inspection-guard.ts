import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Constants} from '../objects/constants';
import {InspectionService} from '../services/inspection.service';

@Injectable({
	providedIn: 'root'
})
export class InspectionGuard implements CanActivate {

	constructor(private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (InspectionService.inspection) {
			return true;
		}
		this.router.navigate([Constants.PATH.INIT]);
		return false;
	}

}
