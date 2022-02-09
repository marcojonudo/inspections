import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Constants} from '../objects/constants';
import {LocalStorageService} from '../services/local-storage.service';
import {InspectionService} from '../services/inspection.service';

@Injectable({
	providedIn: 'root'
})
export class InspectionGuard implements CanActivate {

	constructor(private inspectionService: InspectionService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (InspectionService.inspection) {
			return true;
		}
		const inspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION);
		if (inspection) {
			const loaded = this.inspectionService.loadInfo();
			if (loaded) {
				return true;
			}
		}
		this.router.navigate([Constants.PATH.INIT]);
		return false;
	}

}
