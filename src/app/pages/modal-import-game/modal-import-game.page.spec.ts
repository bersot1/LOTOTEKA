import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalImportGamePage } from './modal-import-game.page';

describe('ModalImportGamePage', () => {
  let component: ModalImportGamePage;
  let fixture: ComponentFixture<ModalImportGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImportGamePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalImportGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
