import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import 'hammerjs';
import {RouterOutlet} from '@angular/router';
import {leaveAnimation, routeAnimations} from './animations';
import {LoadingService} from './services/loading.service';
import {Constants} from './objects/constants';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [routeAnimations, leaveAnimation]
})
export class AppComponent implements OnInit {

	title = 'Revisiones';

	showSplashScreen: boolean;
	loading: boolean;

	constructor(private loadingService: LoadingService, private cdRef: ChangeDetectorRef) {
		this.showSplashScreen = true;
		this.loading = true;
	}

	ngOnInit(): void {
		setTimeout(
			() => {
				this.showSplashScreen = false;
				this.cdRef.detectChanges();
			},
			Constants.SPLASH_SCREEN_DURATION * 1000
		);
		this.loadingService.subscribe((loading: boolean) => {
			this.loading = loading;
			this.cdRef.detectChanges();
		});
	}

	prepareRoute(outlet: RouterOutlet): void {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}

	checkShowSplash(): boolean {
		return this.loading || this.showSplashScreen;
	}

}
