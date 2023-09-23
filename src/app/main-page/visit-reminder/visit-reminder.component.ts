import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-visit-reminder',
	templateUrl: './visit-reminder.component.html',
	styleUrls: ['./visit-reminder.component.css']
})

export class VisitReminderComponent implements OnInit {

	lastReadPage: number = 0;

	ngOnInit(): void {
		this.setLastVisitTime();
		this.getLastReadPage();
	}

	setLastVisitTime() {
		localStorage.setItem('last-visit-reminder', String(Date.now()));
	}

	getLastReadPage() {
		this.lastReadPage = +(localStorage.getItem('last-read-page') || '');
	}

}
