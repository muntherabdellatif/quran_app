import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuranPagesComponent } from './quran-pages.component';

describe('QuranPagesComponent', () => {
  let component: QuranPagesComponent;
  let fixture: ComponentFixture<QuranPagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuranPagesComponent]
    });
    fixture = TestBed.createComponent(QuranPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
