import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DatabaseService } from 'src/app/providers/database.service';
import { GameService } from '../../providers/game.service'


@Component({
  selector: 'app-page-draw-numbers',
  templateUrl: './page-draw-numbers.page.html',
  styleUrls: ['./page-draw-numbers.page.scss'],
})
export class PageDrawNumbersPage implements OnInit {

  public drawNumbers: boolean = false;
  public week: any;
  public numersRandom: any[] = [];
  public objGame: any = {
    week: '',
    numbers: [],
  }


  constructor(
    public alertCtrl: AlertController,
    public dbService: DatabaseService,
    public gameProvider: GameService
   
  ) { }

  ngOnInit() {
    this.startDbSQlite();
  }

  public generateNumbers() {
    this.objGame.numbers = [];
    let validatorNumberEquals = 0;
    let i = 0;

    if (this.week === undefined || this.week === null) {
      this.alerts('PickAWeek')
    }
    else {

      this.formatDate(this.week.split('T'));

      while (i < 15) {
        validatorNumberEquals = 0;
        let min = Math.ceil(1);
        let max = Math.floor(25);
        let result = Math.floor(Math.random() * (max - min)) + min;
        debugger
        if (i === 0) {
          this.objGame.numbers.push(result);
          i++;
        } else {
          this.objGame.numbers.forEach(e => {
            if (e === result) {
              validatorNumberEquals = + 1
            }
          });

          if (validatorNumberEquals === 0) {
            this.objGame.numbers.push(result)
            i++;
          }
        }
      }

    }

    this.drawNumbers = true;



  }

  public async alerts(param: string) {
    if (param = 'PickAWeek') {

      let plasePickAWeek = await this.alertCtrl.create({
        mode: 'ios',
        header: 'Aviso',
        message: 'Favor escolha a semana do jogo',
        buttons: [{ text: 'Ok' }]
      });

      await plasePickAWeek.present();
    }
  }

  public formatDate(date: string) {
    let aux = date[0].split('-')
    this.objGame.week = aux[2] + '/' + aux[1] + '/' + aux[0];

  }


  public startDbSQlite() {
    this.dbService.initDB();
  }

  public async insertGame() {

    let ConfirmSaveGame = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Confirmar',
      message: 'Deseja realmente salvar este jogo?',
      buttons: [{
        text: 'Sim', handler: () => {
          this.gameProvider.insert(this.objGame.week, this.objGame.numbers)
          this.objGame = [];
          this.drawNumbers = false;
        }
      },
      { text: 'Cancelar' }]
    });

    await ConfirmSaveGame.present();

  }

}


