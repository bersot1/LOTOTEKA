import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageMyGamesPage } from './page-my-games.page';

const routes: Routes = [
  {
    path: '',
    component: PageMyGamesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageMyGamesPageRoutingModule {}
