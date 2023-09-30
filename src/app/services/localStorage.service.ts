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
}
