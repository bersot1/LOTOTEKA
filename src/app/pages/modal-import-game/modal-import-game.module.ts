import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalImportGamePageRoutingModule } from './modal-import-game-routing.module';

import { ModalImportGamePage } from './modal-import-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalImportGamePageRoutingModule
  ],
  declarations: [ModalImportGamePage]
})
export class ModalImportGamePageModule {}
