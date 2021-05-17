import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {InspectionService} from "./services/inspection.service";
import {finalize} from "rxjs/operators";

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

    constructor(private cdRef: ChangeDetectorRef, private inspectionService: InspectionService) {}

    ngAfterViewInit(): void {
        this.cdRef.detach();
    }

    searchOrder(shortCode: string = this.orderShortCode): void {
        this.searchingInspections = true;
        this.cdRef.detectChanges();

        this.inspectionService.findInspections(shortCode).pipe(
            finalize(() => {
                this.searchingInspections = false;
                this.cdRef.detectChanges();
            })
        ).subscribe((data) => {
            console.log(data);
        })
    }

}
