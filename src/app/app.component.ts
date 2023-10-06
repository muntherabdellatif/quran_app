import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LightService } from './services/light.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	itIsFirstTime = false;

	readonly oneDayUnix: number = 84600;

	constructor(
		private router: Router,
		private light: LightService,
		private translate: TranslateService,
	) {
		this.translate.setDefaultLang('ar');
	}

	ngOnInit() {
		this.checkLastVisitTime();

		["lastReadingTime", "lastListeningTime"].forEach((key) => {
			if (!localStorage.getItem(key)) {
				localStorage.setItem(key, JSON.stringify(Array.from({ length: 144 }, () => 0)));
			}
		});

		this.light.init();
	}

	checkLastVisitTime() {
		const lastVisitTime = +(localStorage.getItem('last-visit-reminder') || '');
		if (!lastVisitTime)
			return this.router.navigate(['visit_reminder']);

		if ((Date.now() - lastVisitTime) / 1000 >= this.oneDayUnix)
			return this.router.navigate(['visit_reminder']);

		return;
	}

}
