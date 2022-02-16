import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {Constants} from '../objects/constants';
import {LocalStorageService} from '../services/local-storage.service';
import {InspectionService} from '../services/inspection.service';

@Injectable({
	providedIn: 'root'
})
export class InitGuard implements CanActivate {

	constructor(private inspectionService: InspectionService, private router: Router) {}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const manualExit = LocalStorageService.getItem(Constants.LOCAL_STORAGE.MANUAL_EXIT);
		if (!manualExit) {
			if (InspectionService.inspection) {
				this.router.navigate([Constants.PATH.INSPECTION]);
				return false;
			}
			const inspection = LocalStorageService.getItem(Constants.LOCAL_STORAGE.INSPECTION);
			if (inspection) {
				const loaded = this.inspectionService.loadInfo();
				if (loaded) {
					this.router.navigate([Constants.PATH.INSPECTION]);
					return false;
				}
			}
		}
		LocalStorageService.removeItem(Constants.LOCAL_STORAGE.MANUAL_EXIT);
		return true;
	}

}
