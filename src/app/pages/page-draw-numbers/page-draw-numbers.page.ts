import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/providers/database.service';
import { GameService } from '../../providers/game.service';
import * as moment from 'moment';
import { loadingProvider } from 'src/app/providers/loading.service';

import { ModalImportGamePage } from '../modal-import-game/modal-import-game.page';


@Component({
  selector: 'app-page-draw-numbers',
  templateUrl: './page-draw-numbers.page.html',
  styleUrls: ['./page-draw-numbers.page.scss'],
})
export class PageDrawNumbersPage implements OnInit {

  public drawNumbers: boolean = false;
  public isInputMyGame: boolean = false;
  public contentIsLoad: boolean = false;

  public AwardedNumbers: any;

  public objGame: any[] = [];
  public numersRandom: any[] = [];
  public concursos: any[] = [];
  public resultTotal: any[] = [];


  public week: any;
  public myGame: any;
  public loading: any;
  public myGames: any;
  public dateChosen: any;
  public concursoChosen: any;
  public segment: any;



  public registerGame: string;

  public howManyGame: number = 1;
  public howManyNumbers: number = 15;
  public rangeNumbers: number = 25;




  constructor(
    private alertCtrl: AlertController,
    private dbService: DatabaseService,
    private gameProvider: GameService,
    private loadingProvider: loadingProvider,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.contentLoad();
    this.segment = 'randomNumbers';

  }

  public contentLoad() {
    this.startDbSQlite();
    this.getAllConcursos();
    this.getAllMeusJogos();

  }




  public generateNumbers() {

    if (this.registerGame === null || this.registerGame === undefined) {
      this.alert('Aviso!', 'Campo `Data do jogo` é obrigatório');
    } else if (this.rangeNumbers <= this.howManyNumbers) {
      this.alert('Numeros Inválidos', 'Não há como sortear ' + this.howManyGame +
        ' jogo(s) com ' + this.howManyNumbers + ' numeros de intervalo de 1 a ' + this.rangeNumbers + '.');
    } else {
      this.objGame = [];
      let validatorNumberEquals = 0;
      let i = 0;
      let loopinfinito: number = 0;

      for (let index = 0; index < this.howManyGame; index++) {
        this.objGame[index] = {
          id: index + 1,
          MyNumbers: ''
        };
      }

      for (let index = 0; index < this.howManyGame; index++) {
        let arrayAuxGame: any[] = [];

        i = 0;
        while (i < this.howManyNumbers) {

          validatorNumberEquals = 0;
          let min = Math.ceil(1);
          let max = Math.floor(this.rangeNumbers);
          let result: any = Math.floor(Math.random() * (max - min)) + min;
          if (i === 0) {
            arrayAuxGame.push(result);
            i++;
          } else {
            arrayAuxGame.forEach(e => {
              if (e === result) {
                validatorNumberEquals = + 1;
              }
            });

            if (validatorNumberEquals === 0) {
              arrayAuxGame.push(result);
              i++;
            }
          }


          arrayAuxGame.sort(this.compararNumeros);
        }

        if (index > 0) {
          let auxExistedGame = 0;
          let arrayEqual = 0;
          for (let i = 0; i < this.objGame.length; i++) {

            for (let u = 0; u < arrayAuxGame.length; u++) {
              if (this.objGame[i].MyNumbers[u] === arrayAuxGame[u]) {
                arrayEqual++;
              }
            }

            if (arrayEqual === arrayAuxGame.length) {
              auxExistedGame++;
              break;
            } else {
              arrayEqual = 0;
            }
          }

          if (auxExistedGame > 0) {
            index--;
            loopinfinito++;
            if (loopinfinito > 10000) {
              this.alert('Avisa', 'Impossível sortear ' + this.howManyGame + ' jogos diferentes de ' + this.howManyNumbers +
                ' numeros e com intervalo de 1 a  ' + this.rangeNumbers);
              this.objGame = [];

              break;
            }
          } else {
            this.objGame[index].MyNumbers = arrayAuxGame;
          }
        } else {
          this.objGame[index].MyNumbers = arrayAuxGame;
        }
      }
      this.drawNumbers = !this.drawNumbers;
    }



  }

  public selectOlderGame() {
    this.drawNumbers = !this.drawNumbers;
  }

  public startDbSQlite() {
    this.dbService.initDB();
  }

  public async insertGame() {


    if ((this.registerGame === null || this.registerGame === undefined) || this.objGame.length === 0) {
      this.alert('Aviso', 'Campo `data do jogo` obrigatório para salvar. ');

    } else {
      this.objGame.forEach(e => {
        e.Register = moment(this.registerGame).format('DD/MM/YYYY');
      });

      let ConfirmSaveGame = await this.alertCtrl.create({
        mode: 'ios',
        header: 'Confirmar',
        message: 'Deseja realmente salvar este jogo do dia ' + moment(this.registerGame).format('DD/MM/YYYY') + '?',
        buttons: [{
          text: 'Sim', handler: () => {
            this.gameProvider.insertGame(this.objGame);
            this.objGame = [];
            this.drawNumbers = false;
            this.loadingProvider.dismiss();

          }
        },
        { text: 'Cancelar' }]
      });

      await ConfirmSaveGame.present();

    }






  }


  public getAllMeusJogos() {
    this.objGame = [];
    this.resultTotal = [];
    this.gameProvider.getAllOrderByDate().then(data => {
      this.myGames = data;

      this.contentIsLoad = true;
      this.loadingProvider.dismiss();

    });
  }

  public getNumersOfGameByDateChosen() {
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
      let aux: any = data;
      for (let index = 0; index < aux.length; index++) {
        this.objGame[index] = {
          id: index + 1,
          MyNumbers: aux[index].MyNumbers
        };
      }
      this.loadingProvider.dismiss();

    });

  }

  public inputmMyGame() {
    this.isInputMyGame = !this.isInputMyGame;
  }

  public segmentChanged(ev: any) {
    this.contentLoad();
    this.objGame = [];
    this.resultTotal = [];
    this.concursoChosen = '';
    this.concursos = [];

    let e = ev.target.value;
    if (e === 'randomNumbers') {
      this.segment = 'randomNumbers';
    } else {
      this.segment = 'resultGame';
    }

  }

  public clear() {
    this.objGame = [];
    this.registerGame = '';
    this.dateChosen = '';
  }

  public compararNumeros(a, b) {
    return a - b;
  }


  public async alert(eHeader, eMessage) {
    let alert = await this.alertCtrl.create({
      mode: 'ios',
      header: eHeader,
      message: eMessage,
      buttons: [{ text: 'Ok' }]
    });

    await alert.present();
  }

  public async addConcurso() {
    let promptAddConcurso = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Criar concurso',
      message: 'ex: 1,5,6,7,8,10,12,15,20',
      inputs:
        [{
          name: 'numeroConcurso',
          placeholder: 'Nº do Concurso',
          type: 'number'
        },
        {
          name: 'awardedNumbers',
          placeholder: 'Nºs Premiados separados por virgula'
        }], buttons: [{
          text: 'Adicionar',
          handler: data => {
            if (data.numeroConcurso === null || data.awardedNumbers === null) {
              this.alert('Aviso', 'Todos os campos obrigatórios');
            } else {
              this.insertConcursoInDB(data.numeroConcurso, data.awardedNumbers);
            }
          }
        }, {
          text: 'Cancelar'
        }]
    });
    await promptAddConcurso.present();

  }

  public insertConcursoInDB(nConcurso, awardedNumbers) {

    let obj: any = {
      Concurso: nConcurso,
      AwardedNumbers: awardedNumbers
    };

    this.gameProvider.insertConcurso(obj).then(data => {
      this.loadingProvider.dismiss();
      this.alert('Aviso', 'Concurso adicionado com sucesso.');

    });

  }

  public getAllConcursos() {
    this.gameProvider.getAllConcursos().then(data => {
      let aux: any = data;
      for (let index = 0; index < aux.length; index++) {
        this.concursos[index] = {
          Concurso: aux[index].Concurso,
          AwardedNumbers: aux[index].AwardedNumbers
        };
      }
      this.loadingProvider.dismiss();
    });
  }



  public verifyResult() {
    if (this.concursoChosen.length !== 0 && this.dateChosen.length !== 0) {
      this.getConcursoByNumbersOfConcurso();
    } else {
      this.alert('Aviso', 'Campos obrigatórios: Jogo e Concurso');
    }

  }

  public getNumersOfGameByDateChosenResult(concurso) {
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
      let aux: any = data;
      for (let index = 0; index < aux.length; index++) {
        this.objGame[index] = {
          id: index + 1,
          idGame: aux[index].Id,
          MyNumbers: aux[index].MyNumbers
        };
      }
      this.loadingProvider.dismiss();
      this.verifyRightNumbers(concurso);
    });



  }

  public getConcursoByNumbersOfConcurso() {
    this.gameProvider.getConcursoByNumber(this.concursoChosen).then(data => {
      this.getNumersOfGameByDateChosenResult(data[0]);
    });
  }


  public verifyRightNumbers(dataConcurso) {

    this.AwardedNumbers = dataConcurso.AwardedNumbers;



    this.resultTotal = [];

    for (let i = 0; i < this.objGame.length; i++) {
      this.resultTotal[i] = {
        idGame: this.objGame[i].idGame,
        idConcurso: dataConcurso.Concurso,
        rightNumbers: []
      };
    }

    for (let indexGame = 0; indexGame < this.objGame.length; indexGame++) {

      let numbersOfGame: any = this.objGame[indexGame].MyNumbers.split(',');
      let resultSplit: any = dataConcurso.AwardedNumbers.split(',');
      numbersOfGame.forEach(game => {
        resultSplit.forEach(r => {
          if (game === r) {
            this.resultTotal[indexGame].rightNumbers.push(r);
          }
        });
      });

    }

    this.loadingProvider.dismiss();

  }

  public async goToimportGame() {
    let modalImporta = await this.modalCtrl.create({
      component: ModalImportGamePage,
      componentProps: {}
    });

    await modalImporta.present();
  }
}
