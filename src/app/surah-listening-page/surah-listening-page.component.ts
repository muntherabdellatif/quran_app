import { Component, ViewChild } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faStop, faPlay, faPause, faFileAudio, faFileVideo } from '@fortawesome/free-solid-svg-icons';
import { YouTubePlayer } from '@angular/youtube-player';
import { ProgressService } from '../services/progress.service';
import { quranIndex } from 'src/app/data';

interface SurahLink {
	id: number,
	name: string,
	link_id: string,
	mp3_link: string,
}

interface Reader {
	reader_id: number,
	reader_name: string,
	quran: SurahLink[]
}
@Component({
	selector: 'app-surah-listening-page',
	templateUrl: './surah-listening-page.component.html',
	styleUrls: ['./surah-listening-page.component.scss']
})

export class SurahListeningPageComponent {
	@ViewChild(YouTubePlayer) player: YouTubePlayer | undefined;

	quranIndex = quranIndex;

	readers: Reader[] = readers;
	surahId: number = 0;
	readerId: number = 0;
	private apiLoaded = false;
	isVideo: boolean = true;

	playPauseIcon = faPlay;
	faStop = faStop;
	faAnglesLeft = faAnglesLeft;
	faAnglesRight = faAnglesRight;
	faFileAudio = faFileAudio;
	faFileVideo = faFileVideo;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public progress: ProgressService
	) { }

	ngOnInit() {
		// get surah id
		this.route.paramMap.subscribe((params: any) => {
			const id = params.get('id');
			const readerId = params.get('reader');
			if (id) this.surahId = +id;
			if (readerId) this.readerId = +readerId;
			localStorage.setItem('last_listening', JSON.stringify({ readerId: this.readerId, surahId: this.surahId }));
		})

		// prepare youtube player
		if (!this.apiLoaded) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			this.apiLoaded = true;
		}
		this.togglePlayPause();

		// get default reader
	}

	ngAfterViewInit() {
		if (this.player) {
			this.player.stateChange.subscribe((event: any) => {
				if (event.data === YT.PlayerState.ENDED) {
					// Video has ended, perform your desired actions here
					this.progress.addToDoneListening(this.surahId);
				}
			});
		}
	}

	stopVideo() {
		if (this.player)
			this.player.stopVideo();
	}

	togglePlayPause() {
		if (!this.player) return;

		if (this.player.getPlayerState() === 1) {
			this.player.pauseVideo();
			this.playPauseIcon = faPlay;
		} else {
			this.player.playVideo();
			this.playPauseIcon = faPause;
		}
	}

	resetVideo() {
		if (this.player)
			this.player.stopVideo();
		this.playPauseIcon = faPlay;
	}

	toggleIsVideo() {
		this.isVideo = !this.isVideo;
	}

	changeSurah() {
		this.router.navigate(['surah_listening', this.readerId, this.surahId]);
	}
}
