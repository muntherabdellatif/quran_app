import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageModule } from './main-page/main-page.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SurahPageComponent } from './surah-page/surah-page.component';
import { SurahReadingPageComponent } from './surah-reading-page/surah-reading-page.component';
import { SurahListeningPageComponent } from './surah-listening-page/surah-listening-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SurahPageComponent,
    SurahReadingPageComponent,
    SurahListeningPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainPageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
