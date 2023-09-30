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

@NgModule({
	declarations: [
		AppComponent,
		SurahPageComponent,
		SurahReadingPageComponent,
		SurahListeningPageComponent,
		QuranPagesComponent,
		SideBarComponent,
		Mp3Directive,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		MainPageModule,
		YouTubePlayerModule,
		FormsModule,
		NgSelectModule,
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
