import { Component, OnInit } from '@angular/core';
import { faHome ,faBookOpenReader, faHeadphonesSimple  } from '@fortawesome/free-solid-svg-icons';
import { aiehArray } from 'src/app/data/aieh';

@Component({
	selector: 'app-visit-reminder',
	templateUrl: './visit-reminder.component.html',
	styleUrls: ['./visit-reminder.component.scss']
})

export class VisitReminderComponent implements OnInit {
  faHome = faHome;
  faBookOpenReader = faBookOpenReader;
  faHeadphonesSimple = faHeadphonesSimple;
  aiehObj: {aieh: string, aiehNumber: number, surahName: string} = aiehArray[0];
  listiningData: {readerId: number, surahId:number} = {readerId: 0, surahId:0}

	lastReadPage: number = 0;

	ngOnInit(): void {
    const randomIndex = Math.floor(Math.random() * aiehArray.length);
    this.aiehObj = aiehArray[randomIndex]
		this.setLastVisitTime();
		this.getLastReadPage();
    this.getLastListeningData();
	}

	setLastVisitTime() {
		localStorage.setItem('last-visit-reminder', String(Date.now()));
	}

	getLastReadPage() {
		this.lastReadPage = +(localStorage.getItem('last-read-page') || '');
	}

  getLastListeningData() {
    const LastListeningData = JSON.parse(localStorage.getItem('last_listening') || '{}');
    this.listiningData.surahId = LastListeningData?.surahId;
    this.listiningData.readerId = LastListeningData?.readerId;
  }
}
