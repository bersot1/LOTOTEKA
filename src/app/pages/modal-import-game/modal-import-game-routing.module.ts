import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalImportGamePage } from './modal-import-game.page';

const routes: Routes = [
  {
    path: '',
    component: ModalImportGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalImportGamePageRoutingModule {}
