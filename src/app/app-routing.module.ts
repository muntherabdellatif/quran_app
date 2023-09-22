import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurahPageComponent } from './surah-page/surah-page.component';
import { MainPageComponent } from './main-page/main-page/main-page.component';
import { SurahReadingPageComponent } from './surah-reading-page/surah-reading-page.component';
import { SurahListeningPageComponent } from './surah-listening-page/surah-listening-page.component';
import { QuranPagesComponent } from './quran-pages/quran-pages.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'surah/:id', component: SurahPageComponent},
  {path: 'surah_read/:id', component: SurahReadingPageComponent},
  {path: 'surah_listening/:reader/:id', component: SurahListeningPageComponent},
  {path: 'quran_pages/:id', component: QuranPagesComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
