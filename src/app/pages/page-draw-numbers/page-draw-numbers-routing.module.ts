import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageDrawNumbersPage } from './page-draw-numbers.page';

const routes: Routes = [
  {
    path: '',
    component: PageDrawNumbersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageDrawNumbersPageRoutingModule {}
