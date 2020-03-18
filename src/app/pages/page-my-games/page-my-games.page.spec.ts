import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PageMyGamesPage } from './page-my-games.page';

describe('PageMyGamesPage', () => {
  let component: PageMyGamesPage;
  let fixture: ComponentFixture<PageMyGamesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageMyGamesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PageMyGamesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
