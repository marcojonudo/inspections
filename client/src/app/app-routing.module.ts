import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InitialDataComponent} from './components/initial-data/initial-data.component';
import {InspectionComponent} from './components/inspection/inspection.component';
import {InspectionGuard} from './auth/inspection-guard';


const routes: Routes = [
	{path: 'init', component: InitialDataComponent, data: {animation: 'InitPage'}},
	{
		path: 'inspection',
		component: InspectionComponent,
		canActivate: [InspectionGuard],
		data: {animation: 'InspectionPage'}
	},
	{path: '**', pathMatch: 'full', redirectTo: 'init'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
