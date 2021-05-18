import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {InspectionService} from "./services/inspection.service";
import {EmployeeService} from "./services/employee.service";
import {NotificationService} from "./services/notification.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.sass'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('inOutAnimation', [
            transition(
                ':enter',
                [
                    style({ opacity: 0 }),
                    animate('.3s', style({ opacity: 1 }))
                ]
            ),
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
export class AppComponent implements AfterViewInit {
    title = 'client';

    orderShortCode: string;
    searchingInspections: boolean;

    constructor(private cdRef: ChangeDetectorRef, private inspectionService: InspectionService) {
    	EmployeeService.init();
		NotificationService.init();
	}

    ngAfterViewInit(): void {
        this.cdRef.detach();
    }

}
