import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {InitialDataComponent} from './components/initial-data/initial-data.component';
import {InspectionComponent} from './components/inspection/inspection.component';
import {InspectionGuard} from './auth/inspection-guard';
import {EmployeesResolver} from './resolvers/employees-resolver';
import {PrintComponent} from './components/print/print.component';
import {NavigationGuard} from './auth/navigation-guard';


const routes: Routes = [
	{
		path: 'init',
		component: InitialDataComponent,
		canActivate: [NavigationGuard],
		data: { animation: 'InitPage' },
		resolve: { employees: EmployeesResolver }
	},
	{
		path: 'inspection',
		component: InspectionComponent,
		canActivate: [NavigationGuard, InspectionGuard],
		data: {animation: 'InspectionPage'},
		children: [
			{ path: 'print', outlet: 'print', component: PrintComponent }
		]
	},
	{path: '**', pathMatch: 'full', redirectTo: 'init'}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRoutingModule {}
