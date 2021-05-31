import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
	transition('InitPage => InspectionPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(100%)' })]),
		group([
			query(':leave', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(-100%, 0, 0)' }))]),
			query(':enter', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(0, 0, 0)' }))])
		])
	]),
	transition('InspectionPage => InitPage', [
		style({ position: 'relative', 'overflow-x': 'hidden' }),
		query(':enter', [style({ transform: 'translateX(-100%)' })]),
		group([
			query(':leave', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(100%, 0, 0)' }))]),
			query(':enter', [animate('.5s cubic-bezier(0.5, 0.25, 0,1)', style({ transform: 'translate3d(0, 0, 0)' }))])
		])
	])
]);
