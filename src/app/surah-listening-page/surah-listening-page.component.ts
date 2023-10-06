import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { readers } from '../data/readers';
import { ActivatedRoute, Router } from '@angular/router';
import { faAnglesRight, faAnglesLeft, faAngleLeft, faAngleDown, faStop, faPlay, faPause, faFileAudio, faFileVideo } from '@fortawesome/free-solid-svg-icons';
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

	playPauseIcon = faPlay;
	faStop = faStop;
	faAnglesLeft = faAnglesLeft;
	faAngleLeft = faAngleLeft;
	faAnglesRight = faAnglesRight;
	faAngleDown = faAngleDown;
	faFileAudio = faFileAudio;
	faFileVideo = faFileVideo;

	autoPlay: boolean = this.localStorageService.shouldAutoPlay();
	viewReading: boolean = true;
	repeat: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public progress: ProgressService,
		private changeDetectorRef: ChangeDetectorRef,
		public localStorageService: LocalStorageService,
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
	}

	ngAfterViewInit() {
		if (this.player) {
			this.player.stateChange.subscribe((event: any) => {
				if (event.data === YT.PlayerState.ENDED) {
					debugger
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
	}

	toggleShowList() {
		this.showList = !this.showList;
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

	get getSurahFirstPage() {
		const page = this.quranIndex.find(surah => surah.id == this.surahId)?.page || 0;
		if (page)
			return page;

		return null
	}
}
