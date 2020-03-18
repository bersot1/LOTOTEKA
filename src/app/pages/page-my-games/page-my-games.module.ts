import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageMyGamesPageRoutingModule } from './page-my-games-routing.module';

import { PageMyGamesPage } from './page-my-games.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageMyGamesPageRoutingModule
  ],
  declarations: [PageMyGamesPage]
})
export class PageMyGamesPageModule {}
