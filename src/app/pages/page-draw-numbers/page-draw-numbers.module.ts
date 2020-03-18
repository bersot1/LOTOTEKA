import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageDrawNumbersPageRoutingModule } from './page-draw-numbers-routing.module';

import { PageDrawNumbersPage } from './page-draw-numbers.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageDrawNumbersPageRoutingModule
  ],
  declarations: [PageDrawNumbersPage]
})
export class PageDrawNumbersPageModule {}
