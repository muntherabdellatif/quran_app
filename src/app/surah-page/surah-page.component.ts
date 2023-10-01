import { Component } from '@angular/core';
import { quranIndex } from '../data/index';
import { surahInfo } from '../data/info';
import { ActivatedRoute } from '@angular/router';
import { faBrain, faFeatherPointed, faAnglesRight, faAnglesLeft, faCircleCheck, faCircle } from '@fortawesome/free-solid-svg-icons';
import { LightService } from '../services/light.service';
import { LocalStorageService } from '../services/localStorage.service';

interface Surah {
  id: number,
  name: string,
  light: number,
  type: string,
  aiahNumber: number,
  parts: number[],
  lastReadingTime: number;
  lastListeningTime: number,
  surahText: string;
  startPage: number,
  color: { r: number, g: number }
}

@Component({
  selector: 'app-surah-page',
  templateUrl: './surah-page.component.html',
  styleUrls: ['./surah-page.component.scss']
})
export class SurahPageComponent {
  faCircleCheck = faCircleCheck;
  faCircle = faCircle;
  faAnglesRight = faAnglesRight;
  faAnglesLeft = faAnglesLeft;
  faBrain = faBrain;
  faFeatherPointed = faFeatherPointed;
  surahLight = 0;

  surah: Surah = {
    id: 0,
    name: "",
    light: 100,
    type: "مكية",
    aiahNumber: 0,
    parts: [0],
    lastReadingTime: 0,
    lastListeningTime: 0,
    surahText: "",
    startPage: 0,
    color: { r: 0, g: 255 }
  };

  readonly surahInfo = surahInfo;
  readonly quranIndex = quranIndex;
  readerId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private light: LightService,
    private localStorageServices: LocalStorageService,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: any) => {
      const id = params.get('id');
      if (id) {
        this.surah.id = +id;
        this.surah.name = this.quranIndex[+id - 1].name;
        this.surah.light = this.light.getSurahLight(+id);
        this.surah.type = this.surahInfo[+id - 1].type;
        this.surah.aiahNumber = this.surahInfo[+id - 1].aiahNumber;
        this.surah.parts = this.surahInfo[+id - 1].parts;
        this.surah.startPage = this.quranIndex[+id - 1].page;
        this.getLastReadTime();
        this.getLastListeningTime();
        this.getDefaultReader();
        this.getTimeColor();
      }
    })
  }

  getLastReadTime() {
    const lastReadTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");
    if (lastReadTimeArray.length > 0) {
      this.surah.lastReadingTime = lastReadTimeArray[this.surah.id - 1];
    }
  }

  getLastListeningTime() {
    const lastListeningTimeArray = JSON.parse(localStorage.getItem("lastListeningTime") || "[]");
    if (lastListeningTimeArray.length > 0) {
      this.surah.lastListeningTime = lastListeningTimeArray[this.surah.id - 1];
    }
  }

  getDaysOfLastReadTime() {
    if (!this.surah.lastReadingTime)
      return 1;

    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    return Math.floor((timestampInSeconds - this.surah.lastReadingTime) / (60 * 60 * 24));
  }

  getDaysOfLastListeningTime() {
    if (!this.surah.lastListeningTime)
      return 1;

    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    return Math.floor((timestampInSeconds - this.surah.lastListeningTime) / (60 * 60 * 24));
  }

  doneRead() {
    const setLastReadingTime = this.localStorageServices.doneReading(this.surah.id);

    if (setLastReadingTime) {
      const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
      this.surah.lastReadingTime = timestampInSeconds;
    }

    this.surah.light = this.light.getSurahLight(this.surah.id);
  }

  doneListening() {
    const setLastListeningTime = this.localStorageServices.doneListening(this.surah.id);

    if (setLastListeningTime) {
      const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
      this.surah.lastListeningTime = timestampInSeconds;
    }

    this.surah.light = this.light.getSurahLight(this.surah.id);
  }

  getDefaultReader() {
    let readerId = JSON.parse(localStorage.getItem("readerId") || "0");
    if (!readerId) {
      localStorage.setItem("readerId", "1");
      readerId = 1;
    }
    this.readerId = readerId;
  }

  getTimeColor() {
    const days = 60;
    const lastReadDay = Math.min(this.getDaysOfLastReadTime(), 60);
    const lastListeningDay = Math.min(this.getDaysOfLastReadTime(), 60);
    if (lastReadDay < lastListeningDay) {
      this.surah.color.g = 255 - (lastReadDay / days) * 255;
      this.surah.color.r = (lastReadDay / days) * 255;
    } else {
      const average = (lastReadDay + lastListeningDay) / 2;
      this.surah.color.g = 255 - (average / days) * 255;
      this.surah.color.r = (average / days) * 255;
    }
  }

  getFloor(number: number) {
    return Math.floor(number);
  }
}
