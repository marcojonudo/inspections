import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { BottomBarComponent } from './components/bottom-bar/bottom-bar.component';
import { InitialDataComponent } from './components/initial-data/initial-data.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BottomPanelComponent } from './components/bottom-panel/bottom-panel.component';
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

@NgModule({
	declarations: [
		AppComponent,
		BottomBarComponent,
		InitialDataComponent,
		ToastsComponent,
		BottomPanelComponent,
		OrderInfoComponent,
		InspectionComponent,
		LongPressDirective,
		OrderPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		NgbModule,
		MatToolbarModule,
		MatIconModule,
		MatButtonModule,
		MatFormFieldModule,
		MatInputModule,
		MatCardModule,
		ReactiveFormsModule,
		MatProgressSpinnerModule,
		MatListModule,
		MatRippleModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {}
