import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { QuranAriaComponent } from './quran-aria/quran-aria.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MainPageComponent,
    QuranAriaComponent
  ],
  providers: [{provide: Window, useValue: window }],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    QuranAriaComponent,
    MainPageComponent,
    FontAwesomeModule
  ]
})
export class MainPageModule { }
