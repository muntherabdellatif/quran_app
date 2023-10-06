declare var require: any;
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class TranslateFileLoader implements TranslateLoader {
	_currentLanguage: string | undefined;
	_currentData: any;
	constructor() { }

	public getTranslation(lang: string = 'ar'): Observable<any> {
		return Observable.create((observer: any) => {
			if (this._currentLanguage == lang) {
				observer.next(this._currentData);
				observer.complete();
				return observer;
			}

			const data = require('./ar.json');
			this._currentData = data;
			this._currentLanguage = lang;
			observer.next(data);
			observer.complete();
		});
	}
}
