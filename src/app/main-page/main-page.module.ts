import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { QuranAriaComponent } from './quran-aria/quran-aria.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VisitReminderComponent } from './visit-reminder/visit-reminder.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateFileLoaderFactory } from '../app.module';

@NgModule({
	declarations: [
		MainPageComponent,
		QuranAriaComponent,
		VisitReminderComponent
	],
	providers: [{ provide: Window, useValue: window }],
	imports: [
		CommonModule,
		FontAwesomeModule,
		FormsModule,
		RouterModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: TranslateFileLoaderFactory,
			},
		}),
	],
	exports: [
		QuranAriaComponent,
		MainPageComponent,
		FontAwesomeModule
	]
})
export class MainPageModule { }
