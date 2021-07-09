import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {NavigationService} from '../services/navigation.service';

@Injectable({
	providedIn: 'root'
})
export class NavigationGuard implements CanActivate {

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		if (NavigationService.backButtonPressed) {
			NavigationService.backButtonPressed = false;
			return false;
		}
		return true;
	}

}
