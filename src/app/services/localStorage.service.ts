import { Injectable } from '@angular/core';
import { LightService } from './light.service';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {

	constructor(
		private light: LightService,
	) { }

	doneListening(surahIds: number | number[]) {
		if (!Array.isArray(surahIds))
			surahIds = [surahIds];

		let setLastListeningTime = false;

		for (const id of surahIds) {
			const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
			const lastListeningTimeArray = JSON.parse(localStorage.getItem("lastListeningTime") || "[]");

			if (lastListeningTimeArray.length > 0) {
				lastListeningTimeArray[id - 1] = timestampInSeconds;
				localStorage.setItem("lastListeningTime", JSON.stringify(lastListeningTimeArray));
				setLastListeningTime = true;
			}

			this.light.updateSurahLight(id);
			setLastListeningTime = true;
		}

		return setLastListeningTime;
	}

	doneReading(surahIds: number | number[]) {
		if (!Array.isArray(surahIds))
			surahIds = [surahIds];

		let setLastReadingTime = false;
		for (const id of surahIds) {
			const timestampInSeconds = Math.floor(new Date().getTime() / 1000);
			const lastReadingTimeArray = JSON.parse(localStorage.getItem("lastReadingTime") || "[]");

			if (lastReadingTimeArray.length > 0) {
				lastReadingTimeArray[id - 1] = timestampInSeconds;
				localStorage.setItem("lastReadingTime", JSON.stringify(lastReadingTimeArray));
				setLastReadingTime = true;
			}

			this.light.updateSurahLight(id);
			setLastReadingTime = true;
		}
		return setLastReadingTime;
	}

	shouldAutoPlay() {
		return JSON.parse(localStorage.getItem('auto-play') || 'false');
	}

	autoPlayToggle(value: boolean) {
		return localStorage.setItem('auto-play', JSON.stringify(value));
	}

	saveLastSecondListened(readerId: number, surahId: number, lastSecond: number) {
		return localStorage.setItem('last-second-listened', JSON.stringify({ readerId, surahId, lastSecond }));
	}

	restoreLastSecondListened() {
		const lastSecondListened = localStorage.getItem('last-second-listened')
		if (lastSecondListened)
			return JSON.parse(lastSecondListened);

		return null;
	}
}
