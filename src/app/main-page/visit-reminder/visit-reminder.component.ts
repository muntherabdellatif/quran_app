import { Component, OnInit } from '@angular/core';
import { faHome, faBookOpenReader, faHeadphonesSimple, faFeatherPointed } from '@fortawesome/free-solid-svg-icons';
import { aiehArray } from 'src/app/data/aieh';
import { quranIndex } from 'src/app/data';

@Component({
	selector: 'app-visit-reminder',
	templateUrl: './visit-reminder.component.html',
	styleUrls: ['./visit-reminder.component.scss']
})

export class VisitReminderComponent implements OnInit {
	faHome = faHome;
	faBookOpenReader = faBookOpenReader;
	faHeadphonesSimple = faHeadphonesSimple;
	faFeatherPointed = faFeatherPointed;

	aiehObj: { aieh: string, aiehNumber: number, surahName: string } = aiehArray[0];
	listiningData: { readerId: number, surahId: number } = { readerId: 1, surahId: 1 }
	tafseerData: {lecturerId: number, surahId: number, videoId: number } = {lecturerId: 1, surahId: 1, videoId: 0 }

	lastReadPage: number = 0;
	firstListeningTime = true;
	firstTafseerTime = true;

	readonly quranIndex = quranIndex;

	ngOnInit(): void {
		const randomIndex = Math.floor(Math.random() * aiehArray.length);
		this.aiehObj = aiehArray[randomIndex]
		this.setLastVisitTime();
		this.getLastReadPage();
		this.getLastListeningData();
		this.getTafseerData();
	}

	setLastVisitTime() {
		localStorage.setItem('last-visit-reminder', String(Date.now()));
	}

	getLastReadPage() {
		this.lastReadPage = +(localStorage.getItem('last-read-page') || '');
	}

	getLastListeningData() {
		const LastListeningData = JSON.parse(localStorage.getItem('last_listening') || '{}');
		if (LastListeningData?.surahId && LastListeningData?.readerId) {
			this.listiningData.surahId = LastListeningData?.surahId;
			this.listiningData.readerId = LastListeningData?.readerId;
			this.firstListeningTime = false;
		} else {
			this.listiningData = { readerId: this.getDefaultReader(), surahId: 1 };
			this.firstListeningTime = true;
		}
	}

	getDefaultReader() {
		let readerId = JSON.parse(localStorage.getItem("readerId") || "0");
		if (!readerId) {
			localStorage.setItem("readerId", "1");
			readerId = 1;
		}
		return readerId;
	}

	getTafseerData() {
		const LastTafseerData = JSON.parse(localStorage.getItem('last_Tafseer_video') || '{}');
		console.log(LastTafseerData);
		if (LastTafseerData?.surahId && LastTafseerData?.mofasrId) {

			this.tafseerData = {
				surahId: LastTafseerData?.surahId,
				videoId: LastTafseerData?.videoId || 0,
				lecturerId: LastTafseerData?.mofasrId
			}

			this.firstTafseerTime = false;
		} else {
			this.firstTafseerTime = true;
		}
	}

	getFloor(number: number) {
		return Math.floor(number);
	}
}
