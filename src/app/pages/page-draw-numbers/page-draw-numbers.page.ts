import { Component, OnInit, ModuleWithComponentFactories } from '@angular/core';
import { AlertController, NavController, ActionSheetController, LoadingController, ModalController } from '@ionic/angular';
import { DatabaseService } from 'src/app/providers/database.service';
import { GameService } from '../../providers/game.service'
import * as moment from 'moment';
import { loadingProvider } from 'src/app/providers/loading.service';

import { ModalImportGamePage } from '../modal-import-game/modal-import-game.page';
import { recognizeImagemNumberProvider } from 'src/app/providers/recognizeImagemNumber.service';


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


  public resultWeek: string = "1,2,5,6,7,8,10,12,15,16,17,18,20,21,25"
  public registerGame: string;

  public howManyGame: number = 1;




  constructor(
    public alertCtrl: AlertController,
    public dbService: DatabaseService,
    public gameProvider: GameService,
    public navCtrl: NavController,
    private loadingProvider: loadingProvider,
    private modalCtrl: ModalController,
    private imagemRecoUpload: recognizeImagemNumberProvider
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
    this.objGame = [];
    let validatorNumberEquals = 0;
    let i = 0;

    for (let index = 0; index < this.howManyGame; index++) {
      this.objGame[index] = {
        id: index + 1,
        MyNumbers: ''
      }
    }

    for (let index = 0; index < this.howManyGame; index++) {
      let arrayAuxGame: any[] = []
      i = 0
      while (i < 15) {

        validatorNumberEquals = 0;
        let min = Math.ceil(1);
        let max = Math.floor(25);
        let result: any = Math.floor(Math.random() * (max - min)) + min;
        if (i === 0) {
          arrayAuxGame.push(result);
          i++;
        } else {
          arrayAuxGame.forEach(e => {
            if (e === result) {
              validatorNumberEquals = + 1
            }
          });

          if (validatorNumberEquals === 0) {
            arrayAuxGame.push(result)
            i++
          }
        }


        arrayAuxGame.sort(this.compararNumeros)
      }

      if (index > 0) {
        let auxExistedGame = 0
        this.objGame.forEach(e => {
          if (e.NumberOfGame === arrayAuxGame) {
            auxExistedGame += 1
          }
        });

        if (auxExistedGame > 0) {
          index--;
        } else {
          this.objGame[index].MyNumbers = arrayAuxGame;
        }
      } else {
        this.objGame[index].MyNumbers = arrayAuxGame;
      }

    }





    console.log(this.objGame);
    this.drawNumbers = !this.drawNumbers;

  }

  public selectOlderGame() {
    this.drawNumbers = !this.drawNumbers;
  }

  public startDbSQlite() {
    this.dbService.initDB();
  }

  public async insertGame() {
    
  
    if ((this.registerGame === null || this.registerGame === undefined) || this.objGame.length === 0) {
      this.alert('Aviso', 'Campo `data do jogo` obrigatório para salvar. ')
      
    } else {
      this.objGame.forEach(e => {
        e.Register = moment(this.registerGame).format("DD/MM/YYYY")
      });

      let ConfirmSaveGame = await this.alertCtrl.create({
        mode: 'ios',
        header: 'Confirmar',
        message: 'Deseja realmente salvar este jogo do dia ' + moment(this.registerGame).format("DD/MM/YYYY") + '?',
        buttons: [{
          text: 'Sim', handler: () => {
            this.gameProvider.insertGame(this.objGame)
            this.objGame = [];
            this.drawNumbers = false;
            this.loadingProvider.dismiss();

          }
        },
        { text: 'Cancelar' }]
      });

      await ConfirmSaveGame.present();
      console.log('for no insert',this.objGame);
     
    }

     




  }


  public getAllMeusJogos() {
    this.objGame = [];
    this.resultTotal = [];
    this.gameProvider.getAllOrderByDate().then(data => {
      this.myGames = data
      console.log('mygames', this.myGames);

      this.contentIsLoad = true;
      this.loadingProvider.dismiss();

    })
  }

  public getNumersOfGameByDateChosen() {
    console.log(this.dateChosen);
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
      let aux: any = data
      for (let index = 0; index < aux.length; index++) {
        this.objGame[index] = {
          id: index + 1,
          MyNumbers: aux[index].MyNumbers
        }
      }
      this.loadingProvider.dismiss();
      console.log('getNumbersOfGameByDateChosen', this.objGame);

    })

  }

  public inputmMyGame() {
    this.isInputMyGame = !this.isInputMyGame
  }

  public segmentChanged(ev: any) {
    this.contentLoad()
    console.log(ev);
    this.objGame = [];
    this.resultTotal = [];
    this.concursoChosen = "";
    this.concursos = [];

    let e = ev.target.value;
    if (e === 'randomNumbers') {
      this.segment = 'randomNumbers'
    } else {
      this.segment = 'resultGame'
    }

  }

  public salveGame() {

    let split = this.myGame;
    console.log(split.split('.'));

  }

  public clear() {
    this.objGame = []
    this.registerGame = ''
    this.dateChosen = ''
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
    })

    await alert.present();
  }


  //--------------------//
  //----RESULT GAME ----//
  //--------------------//

 

  public saveResult() {
    /*
    idgame this.resultTotal
    result of week
    right numbers

    */

    let obj: any[] = []

    for (let i = 0; i < this.resultTotal.length; i++) {
      obj[i] = {
        IdGame: this.resultTotal[i].idGame,
        ResultOfWeek: this.resultWeek,
        RightNumbers: this.resultTotal[i].rightNumbers
      }

    }

    this.gameProvider.insertResult(obj).then(data => {
      console.log('inserido com sucesso', data);

    })

  }

  public async addConcurso(){
    let promptAddConcurso = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Criar concurso',
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
        if (data.numeroConcurso === null ||  data.awardedNumbers === null) {
          this.alert('Aviso', 'Todos os campos obrigatórios')
        } else {
          this.insertConcursoInDB(data.numeroConcurso, data.awardedNumbers);
        }
      }
    },{
      text: 'Cancelar'
    }]
    }) 
    await promptAddConcurso.present()
    
  }

  public insertConcursoInDB(nConcurso, awardedNumbers){
    console.log(nConcurso, awardedNumbers);

    let obj: any = {
      Concurso: nConcurso,
      AwardedNumbers: awardedNumbers
    }

    this.gameProvider.insertConcurso(obj).then(data => {
      this.loadingProvider.dismiss();
      this.alert('Aviso', 'Concurso adicionado com sucesso.')
      console.log(data);
      
    })
    
  }

  public getAllConcursos(){
    this.gameProvider.getAllConcursos().then(data => {
      let aux: any = data;
      for (let index = 0; index < aux.length; index++) {
        this.concursos[index] = {
          Concurso: aux[index].Concurso,
          AwardedNumbers: aux[index].AwardedNumbers
        }
      }
      this.loadingProvider.dismiss();
    })
  }

  

  public verifyResult(){
    this.getConcursoByNumbersOfConcurso();
  }

  public getNumersOfGameByDateChosenResult(concurso) {
    console.log(this.dateChosen);
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
      let aux: any = data
      for (let index = 0; index < aux.length; index++) {
        this.objGame[index] = {
          id: index + 1,
          idGame: aux[index].Id,
          MyNumbers: aux[index].MyNumbers
        }
      }
      this.loadingProvider.dismiss();
      console.log('getNumbersOfGameByDateChosen', this.objGame);
      this.verifyRightNumbers(concurso);
    })

    

  }
  
  public getConcursoByNumbersOfConcurso(){ 
    this.gameProvider.getConcursoByNumber(this.concursoChosen).then(data => {
      this.getNumersOfGameByDateChosenResult(data[0]);
    })
  }


  public verifyRightNumbers(dataConcurso) {
    console.log('data concurso',dataConcurso);
    console.log('obj game',this.objGame);

    this.AwardedNumbers = dataConcurso.AwardedNumbers;
    
    

    this.resultTotal = [];

    for (let i = 0; i < this.objGame.length; i++) {
      this.resultTotal[i] = {
        idGame: this.objGame[i].idGame,
        idConcurso: dataConcurso.Concurso,
        rightNumbers: []
      }
    }

    for (let indexGame = 0; indexGame < this.objGame.length; indexGame++) {
      
      let numbersOfGame: any = this.objGame[indexGame].MyNumbers.split(',');
      let resultSplit: any = dataConcurso.AwardedNumbers.split(',');
      numbersOfGame.forEach(game => {
        resultSplit.forEach(r => {
          if (game == r) {
            this.resultTotal[indexGame].rightNumbers.push(r);
          }
        });
      });

    }

    this.loadingProvider.dismiss();
    console.log('acabo for', this.resultTotal);
    

    /*
    TODO:
      * fazer no html 25 botões com valores inteiros para o user ir clicando nas bolinhas do resultado
      * fazer component - modal  e usar também no input de um jogo ja realizada 
      * terminar essa logica no metodo teste q contabiliza quantos acertos o jogo tem no resultado
    
    */

  }

  public async goToimportGame(){
    let modalImporta = await this.modalCtrl.create({
      component: ModalImportGamePage,
      componentProps: {}
    });

    await modalImporta.present();
  }


}