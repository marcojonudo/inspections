import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Url} from "../objects/url";

@Injectable({
    providedIn: 'root'
})
export class InspectionService {

    constructor(private http: HttpClient) {}

    findInspections(shortCode: string): Observable<any> {
        const url = `${Url.inspections()}?shortCode=${shortCode}`
        return this.http.get(url);
    }
}
