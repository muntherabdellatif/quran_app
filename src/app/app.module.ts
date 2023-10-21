import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageModule } from './main-page/main-page.module';
import { SurahPageComponent } from './surah-page/surah-page.component';
import { SurahReadingPageComponent } from './surah-reading-page/surah-reading-page.component';
import { SurahListeningPageComponent } from './surah-listening-page/surah-listening-page.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { QuranPagesComponent } from './quran-pages/quran-pages.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { Mp3Directive } from './directive/mp3.directive';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateFileLoader } from './shared/translation/TranslateFileLoader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MeditationComponent } from './meditation/meditation.component';
import { HttpClientModule } from '@angular/common/http';
import { ReadingVerticalScrollComponent } from './reading-vertical-scroll/reading-vertical-scroll.component';
import { ReadingHorizontalScrollComponent } from './reading-horizontal-scroll/reading-horizontal-scroll.component';

export function TranslateFileLoaderFactory() {
	return new TranslateFileLoader();
}

@NgModule({
	declarations: [
		AppComponent,
		SurahPageComponent,
		SurahReadingPageComponent,
		SurahListeningPageComponent,
		QuranPagesComponent,
		SideBarComponent,
		Mp3Directive,
		MeditationComponent,
    ReadingVerticalScrollComponent,
    ReadingHorizontalScrollComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		MainPageModule,
		YouTubePlayerModule,
		FormsModule,
		HttpClientModule,
		NgSelectModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: TranslateFileLoaderFactory,
			},
		}),
	],
	providers: [TranslateService],
	bootstrap: [AppComponent]
})
export class AppModule { }
