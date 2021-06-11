import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Constants} from '../objects/constants';
import {InspectionService} from '../services/inspection.service';
import {LocalStorageService} from '../services/local-storage.service';

@Injectable({
	providedIn: 'root'
})
export class InitGuard implements CanActivate {

	constructor(private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (InspectionService.inspection) {
			this.router.navigate([Constants.PATH.INSPECTION]);
			return false;
		}
		const inspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION);
		if (inspection) {
			InspectionService.loadInfo();
			this.router.navigate([Constants.PATH.INSPECTION]);
			return false;
		}
		return true;
	}

}
