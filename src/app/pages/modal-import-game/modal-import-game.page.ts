import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { GameService } from 'src/app/providers/game.service';
import { loadingProvider } from 'src/app/providers/loading.service';
@Component({
  selector: 'app-modal-import-game',
  templateUrl: './modal-import-game.page.html',
  styleUrls: ['./modal-import-game.page.scss'],
})
export class ModalImportGamePage implements OnInit {

  public howManyGames: number;

  public registerGame: string;

  public games: any[] = []

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private gameProvider: GameService,
    private loadingProvider: loadingProvider
  ) { }

  ngOnInit() {
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  makeMaskGame(e) {

    console.log(e.detail.value);

    this.games = [];
    let aux: any = e.detail.value



    for (let index = 0; index < aux; index++) {
      this.games[index] = {
        Index: index + 1,
        Register: this.registerGame,
        Numbers: ''
      }

    }
  }

  public saveGame() {
    this.registerGame = moment(this.registerGame).format("DD/MM/YYYY")
    if (this.registerGame === null || this.registerGame === undefined) {
      this.alert('Aviso', 'Campos obrigatórios não preenchidos.')
    } else {
      this.insertGame();
    }
    console.log(this.games);

  }

  public insertGame() {
    for (let i = 0; i < this.games.length; i++) {
      this.games[i] = {
        Register: this.registerGame,
        MyNumbers: this.games[i].Numbers
      }

    }

    this.gameProvider.insertGame(this.games).then(data => {
      this.alert('Aviso', 'Jogo(s) importados com sucesso.')
      this.close();
      this.loadingProvider.dismiss();


    })
  }

  async alert(eHeader, eMessage) {
    let alert = await this.alertCtrl.create({
      mode: 'ios',
      header: eHeader,
      message: eMessage,
      buttons: [{ text: 'Ok' }]

    });
    await alert.present();
  }
}
