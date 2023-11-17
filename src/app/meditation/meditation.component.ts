import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { YouTubePlayer } from '@angular/youtube-player';
import { mofasreen } from '../data/tafseer';
import {
	faAnglesRight, faAnglesLeft, faAngleLeft, faAngleDown, faCheckSquare, faSquare,
	faStop, faPlay, faPause, faFileAudio, faFileVideo, faGear, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { quranIndex } from 'src/app/data';
import { ProgressService } from '../services/progress.service';
import { LocalStorageService } from '../services/localStorage.service';

interface Video {
	link_id?: string,
	start?: number | null,
	end?: number | null,
	number?: number
}

interface Surah {
	id: number,
	name: string,
	videoArray: Video[],
}

interface Mofasreen {
	id: number,
	name: string,
	type: string,
	quran: Surah[],
}

@Component({
	selector: 'app-meditation',
	templateUrl: './meditation.component.html',
	styleUrls: ['./meditation.component.scss']
})
export class MeditationComponent {
	@ViewChild(YouTubePlayer) player: YouTubePlayer | undefined;
	@ViewChild('youTubePlayer') youTubePlayer: ElementRef<HTMLDivElement> | undefined;
	autoPlay: boolean = this.localStorageService.shouldAutoPlay();

	quranIndex = quranIndex;
	quranIndexFiltered: any[] = ['filter', ...quranIndex];
	surahFilter: string = '';

	showSettingPopup: boolean = false;
	videoHeight: number | undefined;
	videoWidth: number | undefined;
	private apiLoaded = false;
	showList: boolean = false;

	mofasreen: Mofasreen[] = mofasreen;
	surahId: number = 1;
	mofasrId: number = 1;
	videoIndex = 0;

	upDownAngle = faAngleDown;
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
	faSquare = faSquare;
	faCheckSquare = faCheckSquare;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public progress: ProgressService,
		private changeDetectorRef: ChangeDetectorRef,
		public localStorageService: LocalStorageService,
	) {}

	ngOnInit() {
		this.route.paramMap.subscribe((params: any) => {
			const id = params.get('id');
			const mofasrId = params.get('mofasr');
			this.videoIndex = params.get('video_id') ? +params.get('video_id') : 0;
			if (id) this.surahId = +id;
			if (mofasrId) this.mofasrId = +mofasrId;
			localStorage.setItem('last_Tafseer_video', JSON.stringify({ mofasrId, surahId: this.surahId, videoId: this.videoIndex }));
		})

		// prepare youtube player
		if (!this.apiLoaded) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			document.body.appendChild(tag);
			this.apiLoaded = true;
		}
	}

	playerPlayedPaused(event: any) {
		if (event.data == 2)
			return this.playPauseIcon = faPlay;
		if (event.data == 3)
			return this.playPauseIcon = faPause;

		return;
	}


	stopVideo() {
		if (this.player)
			this.player.stopVideo();
	}

	resetVideo() {
		if (this.player)
			this.player.stopVideo();

		this.playPauseIcon = faPlay;
	}


	ToggleSettingPopup() {
		this.showSettingPopup = !this.showSettingPopup;
	}

	toggleShowList() {
		this.showList = !this.showList;
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

	filterSurah() {
		if (!this.surahFilter)
			return this.quranIndexFiltered = ['filter', ...this.quranIndex];

		return this.quranIndexFiltered = ['filter', ...this.quranIndex.filter((surah: { name: string }) => surah.name.includes(this.surahFilter))];
	}

	changeSurah(surahId: number) {
		this.router.navigate(['meditation', this.mofasrId, surahId, this.videoIndex]);
		this.showList = !this.showList;
	}

	ngAfterViewInit() {
		// if (this.player) {
		// 	this.player.stateChange.subscribe((event: any) => {
		// 		if (event.data === YT.PlayerState.ENDED) {
		// 			if (this.repeat) {
		// 				setTimeout(() => {
		// 					return this.player?.playVideo();
		// 				}, 2000);
		// 			}

		// 			// Video has ended, perform your desired actions here
		// 			this.doneListening();
		// 		}
		// 	});
		// }

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

	autoPlayToggle() {
		this.autoPlay = !this.autoPlay;
		this.localStorageService.autoPlayToggle(this.autoPlay);
	}

	hasVideos(mofasrId: number, surahId: number) {
		const videoArray = this.mofasreen[mofasrId - 1]?.quran[surahId - 1]?.videoArray;
		return videoArray && videoArray.length;
	}

	changeVideo(selectedVideo: Video) {
		const videoArray = this.mofasreen[this.mofasrId - 1]?.quran[this.surahId - 1]?.videoArray;
		videoArray.forEach((video , index) => {
			if (video.link_id == selectedVideo.link_id)
				this.videoIndex = index;
		})
		this.router.navigate(['meditation', this.mofasrId, this.surahId,  this.videoIndex]);
	}

	getVideosList () {
		const list = [];
		const videoArray = this.mofasreen[this.mofasrId - 1].quran[this.surahId -1].videoArray
		const maxIndex = videoArray.length - 1;


		if (this.videoIndex > 1)
			list.push(videoArray[this.videoIndex - 2]);
		if (this.videoIndex > 0)
			list.push(videoArray[this.videoIndex - 1]);

		list.push(videoArray[this.videoIndex]);

		if (this.videoIndex < maxIndex)
			list.push(videoArray[this.videoIndex + 1]);
		if (this.videoIndex < maxIndex - 1)
			list.push(videoArray[this.videoIndex + 2]);

		return list;
	}
}
