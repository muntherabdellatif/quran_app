import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faAngleLeft, faAngleDown, faStop, faPlay, faPause, faFileAudio, faFileVideo, faGear, faXmark } from '@fortawesome/free-solid-svg-icons';
import { YouTubePlayer } from '@angular/youtube-player';
import { ProgressService } from '../services/progress.service';
import { quranIndex } from 'src/app/data';
import { LocalStorageService } from '../services/localStorage.service';

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
	@ViewChild('youTubePlayer') youTubePlayer: ElementRef<HTMLDivElement> | undefined;

	quranIndex = quranIndex;
	quranIndexFiltered: any[] = ['filter', ...quranIndex];
	surahFilter: string = '';

	videoHeight: number | undefined;
	videoWidth: number | undefined;
	@ViewChild('mp3Player') mp3Player: any;

	readers: Reader[] = readers;
	surahId: number = 0;
	readerId: number = 0;
	private apiLoaded = false;
	isVideo: boolean = true;
	showList: boolean = false;
	showSettingPopup: boolean = false;

	playPauseIcon = faPlay;
	faStop = faStop;
	faAnglesLeft = faAnglesLeft;
	faAngleLeft = faAngleLeft;
	faAnglesRight = faAnglesRight;
	faAngleDown = faAngleDown;
	faFileAudio = faFileAudio;
	faFileVideo = faFileVideo;
	faGear = faGear;
	faXmark = faXmark;

	autoPlay: boolean = this.localStorageService.shouldAutoPlay();
	viewReading: boolean = true;
	repeat: boolean = false;
	pagesNumber: any[] = Array.from({ length: 604 }, (_, index) => index + 1);
	surahPages: string[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public progress: ProgressService,
		private changeDetectorRef: ChangeDetectorRef,
		public localStorageService: LocalStorageService,
	) {
		this.pagesNumber.forEach(n => {
			this.pagesNumber[n - 1] = String(this.pagesNumber[n - 1]).padStart(3, '0')
		});
	}

	ngOnInit() {
		this.readers = this.readers.sort((a: any, b: any) => (a.reader_name > b.reader_name) ? 1 : ((b.reader_name > a.reader_name) ? -1 : 0));
		// get surah id

		this.route.paramMap.subscribe((params: any) => {
			const id = params.get('id');
			const readerId = params.get('reader');
			if (id) this.surahId = +id;
			if (readerId) this.readerId = +readerId;
			this.getSurahPages();
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
		this.restoreLastSecondListened();
		this.saveLastSecondListened();
	}

	ngAfterViewInit() {
		if (this.player) {
			this.player.stateChange.subscribe((event: any) => {
				if (event.data === YT.PlayerState.ENDED) {
					if (this.repeat) {
						setTimeout(() => {
							return this.player?.playVideo();
						}, 2000);
					}

					// Video has ended, perform your desired actions here
					this.doneListening();
				}
			});
		}

		this.onResize();
		window.addEventListener('resize', this.onResize.bind(this));
	}

	onResize(): void {
		const PageWidth = window.innerWidth;
		if (this.youTubePlayer)
			this.videoWidth = Math.min(
				PageWidth * 0.85,
				1200
			);
		this.videoHeight = this.videoWidth ? this.videoWidth * 0.6 : 1200 * 0.6;
		this.changeDetectorRef.detectChanges();
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

	togglePlayPauseAudio() {
		if (!this.mp3Player)
			return;

		if (!this.mp3Player.nativeElement.paused) {
			this.mp3Player?.nativeElement.pause();
			this.playPauseIcon = faPlay;
		} else {
			this.mp3Player?.nativeElement.play();
			this.playPauseIcon = faPause;
		}
	}

	stopMp3() {
		if (this.mp3Player)
			this.mp3Player.nativeElement.pause();
	}

	resetVideo() {
		if (this.player)
			this.player.stopVideo();

		if (this.mp3Player)
			this.mp3Player.nativeElement.pause();

		this.playPauseIcon = faPlay;
	}

	toggleIsVideo() {
		this.isVideo = !this.isVideo;
		this.restoreLastSecondListened();
	}

	toggleShowList() {
		this.showList = !this.showList;
	}

	toggleRepeat() {
		this.repeat = !this.repeat;
	}

	toggleViewReading() {
		this.viewReading = !this.viewReading;
	}

	ToggleSettingPopup() {
		this.showSettingPopup = !this.showSettingPopup;
	}

	changeSurah(surahId: number) {
		this.router.navigate(['surah_listening', this.readerId, surahId]);
		this.showList = !this.showList;
	}

	mp3Done() {
		if (this.repeat)
			setTimeout(() => {
				return this.mp3Player?.nativeElement.play();
			}, 2000);

		if (this.localStorageService.shouldAutoPlay() && this.surahId < 114) {
			this.router.navigate(['surah_listening', this.readerId, this.surahId + 1]);

			setTimeout(() => {
				if (this.isVideo)
					this.togglePlayPause();
				else
					this.mp3Player?.nativeElement.play();
			}, 2000);
		}

		this.doneListening();
	}

	doneListening() {
		this.progress.addToDoneListening(this.surahId);
	}

	autoPlayToggle() {
		this.autoPlay = !this.autoPlay;
		this.localStorageService.autoPlayToggle(this.autoPlay);
	}

	filterSurah() {
		if (!this.surahFilter)
			return this.quranIndexFiltered = ['filter', ...this.quranIndex];

		return this.quranIndexFiltered = ['filter', ...this.quranIndex.filter((surah: { name: string }) => surah.name.includes(this.surahFilter))];
	}

	mp3Played() {
		this.playPauseIcon = faPause;
	}

	mp3Paused() {
		this.playPauseIcon = faPlay;
	}

	playerPlayedPaused(event: any) {
		if (event.data == 2)
			return this.playPauseIcon = faPlay;
		if (event.data == 3)
			return this.playPauseIcon = faPause;

		return;
	}

	get getReaderInfo() {
		const reader = this.readers.find(reader => reader.reader_id == this.readerId);
		if (reader)
			return reader;

		return null;
	}

	get getSurahFirstPage() {
		const page = this.quranIndex.find(surah => surah.id == this.surahId)?.page || 0;
		if (page)
			return page;

		return null
	}

	getSurahPages() {
		const surahFirstPage = Math.floor(this.quranIndex[this.surahId - 1].page);
		let surahLastPage = Math.floor(surahFirstPage);
		const nextSurah = this.quranIndex[this.surahId];
		if (nextSurah)
			surahLastPage = Math.floor(nextSurah.page) == nextSurah.page ? nextSurah.page - 1 : Math.floor(nextSurah.page);

		const surahPages: string[] = [];

		this.pagesNumber.forEach((page) => {
			if (+page >= surahFirstPage && +page <= surahLastPage)
				surahPages.push(page);
		});

		this.surahPages = surahPages;
	}

	restoreLastSecondListened() {
		const savedLastSecondListened = this.localStorageService.restoreLastSecondListened();
		if (!savedLastSecondListened)
			return;

		if (savedLastSecondListened.readerId != this.readerId || savedLastSecondListened.surahId != this.surahId)
			return;

		setTimeout(() => {
			if (this.mp3Player) {
				this.mp3Player.nativeElement.currentTime = savedLastSecondListened.lastSecond;
				this.mp3Player.nativeElement.play();
			} else if (this.player)
				this.player.startSeconds = savedLastSecondListened.lastSecond;
		}, 1000);
	}

	saveLastSecondListened() {
		let lastSecond = 0;

		setTimeout(() => {
			if (this.mp3Player)
				lastSecond = this.mp3Player.nativeElement.currentTime;
			else if (this.player)
				lastSecond = this.player.getCurrentTime();

			if (lastSecond)
				this.localStorageService.saveLastSecondListened(this.readerId, this.surahId, lastSecond);

			this.saveLastSecondListened();
		}, 5000);
	}

	doneReading(surahId: number) {
		this.localStorageService.doneReading(surahId);
	}
}
