import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LightService {
  quranLightArray: number[] = Array.from({ length: 144 }, () => 0);
  dayLimit = 60;

  constructor() {
    const quranLightArray = JSON.parse(localStorage.getItem('quran-light-array') || '[]');
    if (!quranLightArray.length)
      localStorage.setItem('quran-light-array', JSON.stringify(this.quranLightArray));
  }

  updateSurahLight(surahId: number) {
    // get surah data
    const lastReadDay = this.getLastReadDay(surahId);
    const lastListeningDay = this.getLastListeningDay(surahId);

    const surahLight = this.calculateSurahLight(lastReadDay, lastListeningDay);
    this.quranLightArray[surahId -1] = surahLight;
    localStorage.setItem('quran-light-array', JSON.stringify(this.quranLightArray));
  }

  private calculateSurahLight(lastReadDay: number, lastListeningDay: number) {
    // find read points
    let readPoints = 0;
    if (lastReadDay < this.dayLimit / 2)
      readPoints = 100;
    else if (lastReadDay < this.dayLimit )
      readPoints = 100 * (this.dayLimit / 2 - (lastReadDay - this.dayLimit / 2))/(this.dayLimit / 2);

    // find listen points
    let listenPoints = 0;
    if (lastListeningDay < this.dayLimit / 2)
      listenPoints = 50;
    else if (lastListeningDay < this.dayLimit )
      listenPoints = 50 * (this.dayLimit / 2 - (lastListeningDay - this.dayLimit / 2))/(this.dayLimit / 2);

    const readAndListenPoints = Math.min(100,readPoints + listenPoints);

    return readAndListenPoints;
  }

  init() {
    const quranLightArray = JSON.parse(localStorage.getItem('quran-light-array') || '[]');
    const lightArray: number[] = [];
    quranLightArray.forEach((surah: any, index: number) => {
      const surahId = index + 1;
      const lastReadDay = this.getLastReadDay(surahId);
      const lastListeningDay = this.getLastListeningDay(surahId);
      const surahLight = this.calculateSurahLight(lastReadDay, lastListeningDay);
      lightArray.push(surahLight);
    });
    localStorage.setItem('quran-light-array', JSON.stringify(lightArray));
    this.quranLightArray = lightArray;
  }

  getSurahLight(surahId: number) {
    return this.quranLightArray[surahId -1];
  }

  getQuranLightArray() {
    return this.quranLightArray;
  }

  private getLastReadDay (surahId: number) {
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    let lastReadDay = this.dayLimit;

    const lastReadTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");
    if (lastReadTimeArray.length > 0) {
      const lastReadTime = lastReadTimeArray[surahId - 1];
      lastReadDay =  Math.floor((timestampInSeconds - lastReadTime)/(60 * 60 * 24));
    }

    return lastReadDay;
  }

  private getLastListeningDay (surahId: number) {
    const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
    let lastListeningDay = this.dayLimit;

    const lastListeningTimeArray = JSON.parse(localStorage.getItem("lastListeningTime") || "[]");
    if (lastListeningTimeArray.length > 0) {
      const lastListeningTime = lastListeningTimeArray[surahId - 1];
      lastListeningDay =  Math.floor((timestampInSeconds - lastListeningTime)/(60 * 60 * 24));
    }

    return lastListeningDay;
  }
}
