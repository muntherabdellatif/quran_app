import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurahPageComponent } from './surah-page/surah-page.component';
import { MainPageComponent } from './main-page/main-page/main-page.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'surah/:id', component: SurahPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
