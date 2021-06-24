import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { InitialDataComponent } from './components/initial-data/initial-data.component';
import {OrderInfoComponent} from './components/bottom-panel/order-info/order-info.component';
import { InspectionComponent } from './components/inspection/inspection.component';
import { LongPressDirective } from './directives/long-press.directive';
import { OrderPipe } from './pipes/order.pipe';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {MatRippleModule} from '@angular/material/core';
import { LegendComponent } from './components/bottom-panel/legend/legend.component';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { EmployeeInfoComponent } from './components/bottom-panel/employee-info/employee-info.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MenuComponent } from './components/bottom-panel/menu/menu.component';
import localeEs from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localeEs);
import * as dayjs from 'dayjs';
import * as es from 'dayjs/locale/es';
import {Constants} from './objects/constants';
import {MatExpansionModule} from '@angular/material/expansion';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { ResetEmployeeDialogComponent } from './components/reset-employee-dialog/reset-employee-dialog.component';
import { PrintComponent } from './components/print/print.component';
import {MatTableModule} from '@angular/material/table';
import {ChartsModule} from 'ng2-charts';

@NgModule({
	declarations: [
		AppComponent,
		BottomBarComponent,
		InitialDataComponent,
		OrderInfoComponent,
		InspectionComponent,
		LongPressDirective,
		OrderPipe,
		LegendComponent,
		EmployeeInfoComponent,
		ConfirmDialogComponent,
		MenuComponent,
		SplashScreenComponent,
		ResetEmployeeDialogComponent,
		PrintComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		MatListModule,
		MatRippleModule,
		MatBottomSheetModule,
		MatSnackBarModule,
		MatDialogModule,
		MatExpansionModule,
		MatTableModule,
		ChartsModule
	],
	providers: [OrderPipe],
	bootstrap: [AppComponent]
})
export class AppModule {

	constructor() {
		dayjs.locale(es);
		dayjs.prototype.toJSON = function() {
			return this.format(Constants.DATE_TIME_FORMAT.yyyy_MM_dd_HH_mm_ss);
		};
	}

}
