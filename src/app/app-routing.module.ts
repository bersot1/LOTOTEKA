import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  { path: '', redirectTo: '/page-draw-numbers', pathMatch: 'full' },
  { path: 'page-draw-numbers', loadChildren: './pages/page-draw-numbers/page-draw-numbers.module#PageDrawNumbersPageModule' },

  {
    path: 'modal-import-game',
    loadChildren: () => import('./pages/modal-import-game/modal-import-game.module').then(m => m.ModalImportGamePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
