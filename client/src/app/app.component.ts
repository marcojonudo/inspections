import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import 'hammerjs';
import {RouterOutlet} from '@angular/router';
import {routeAnimations} from './animations';
import {LoadingService} from './services/loading.service';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.sass'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		routeAnimations,
		trigger('leaveAnimation', [
			transition(
				':leave',
				[
					style({ opacity: 1 }),
					animate('.3s', style({ opacity: 0 }))
				]
			)
		])
	]
})
export class AppComponent implements OnInit {

	title = 'Revisiones';

	private readonly SPLASH_SCREEN_DURATION: number = 1.5;

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
			this.SPLASH_SCREEN_DURATION * 1000
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
