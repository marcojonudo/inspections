import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
	transition('InitPage => InspectionPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(100%)' })]),
		group([
			query(':leave', [animate('1s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translateX(-100%)' }))]),
			query(':enter', [animate('1s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translateX(0)' }))])
		])
	]),
	transition('InspectionPage => InitPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(-100%)' })]),
		group([
			query(':leave', [animate('1s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translateX(100%)' }))]),
			query(':enter', [animate('1s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translateX(0)' }))])
		])
	])
]);
