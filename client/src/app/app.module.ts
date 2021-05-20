import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { InitialDataComponent } from './components/initial-data/initial-data.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BottomPanelComponent } from './components/bottom-panel/bottom-panel.component';
import {OrderInfoComponent} from './components/bottom-panel/order-info/order-info.component';
import { InspectionComponent } from './components/inspection/inspection.component';

@NgModule({
	declarations: [
		AppComponent,
		BottomBarComponent,
		InitialDataComponent,
		ToastsComponent,
		BottomPanelComponent,
		OrderInfoComponent,
		InspectionComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		NgbModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
