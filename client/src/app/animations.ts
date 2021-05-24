import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
	transition('InitPage => InspectionPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(100%)' })]),
		group([
			query(':leave', [animate('.5s ease-out', style({ transform: 'translateX(-100%)' }))]),
			query(':enter', [animate('.5s ease-out', style({ transform: 'translateX(0)' }))])
		])
	])
]);
