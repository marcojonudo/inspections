import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Url} from '../objects/url';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LocalStorageService} from './local-storage.service';
import {Constants} from '../objects/constants';

@Injectable({
	providedIn: 'root'
})
export class VersionService {

	constructor(private http: HttpClient) {}

	getVersion(): Observable<any> {
		return this.http.get(Url.info()).pipe(
			map((data: any) => data.git.tags)
		);
	}

	handleVersion(scheduled: boolean, refreshed: boolean): Observable<boolean> {
		return this.getVersion().pipe(
			map(version => {
				if (version) {
					const existent = LocalStorageService.getItem(Constants.LOCAL_STORAGE.VERSION);
					if (!existent || (refreshed && !scheduled)) {
						LocalStorageService.setItem(Constants.LOCAL_STORAGE.VERSION, version);
						return false;
					}
					return existent !== version;
				}
				return false;
			})
		);
	}

}
