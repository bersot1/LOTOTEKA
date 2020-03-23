import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { PageDrawNumbersPage  } from '../app/pages/page-draw-numbers/page-draw-numbers.page'
import { DatabaseService } from '../app/providers/database.service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  rootPage: any = null;
  constructor(
    private platform: Platform,
    splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public dbProvider:DatabaseService
  ) {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent ();

      dbProvider.createDataBase()
      .then(() => {
        // fechando a SplashScreen somente quando o banco for criado
        this.openHomePage(splashScreen);
      })
      .catch(() => {
        // ou se houver erro na criação do banco
        this.openHomePage(splashScreen);
      });
      
    });
  }

  initializeApp() {
    
  }

  private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.rootPage = PageDrawNumbersPage;
  }
}
