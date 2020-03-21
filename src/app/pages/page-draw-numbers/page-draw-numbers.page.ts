import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { DatabaseService } from 'src/app/providers/database.service';
import { GameService } from '../../providers/game.service'
import * as Tesseract from 'tesseract.js'
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import * as moment from 'moment';


@Component({
  selector: 'app-page-draw-numbers',
  templateUrl: './page-draw-numbers.page.html',
  styleUrls: ['./page-draw-numbers.page.scss'],
})
export class PageDrawNumbersPage implements OnInit {

  public drawNumbers: boolean = false;
  public isInputMyGame: boolean = false;
  public contentIsLoad: boolean = false;

  public objGame: any[] = [];
  public numersRandom: any[] = [];
  public resultWeek: number;

  public week: any;
  public myGame: any;
  public loading: any;
  public myGames: any;
  public dateChosen: any;
  public segment: any;
  
  public selectedImage: string;
  public imageText: string;

  public howManyGame: number = 1;
  



  constructor(
    public alertCtrl: AlertController,
    public dbService: DatabaseService,
    public gameProvider: GameService,
    public navCtrl: NavController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.contentLoad();
    
  }

  public contentLoad() {
    this.segment = 'randomNumbers'
    this.startDbSQlite();
    this.getAllMeusJogos();
    
  }

  public generateNumbers() {
    debugger
    if (this.week === undefined || this.week === null) {
      this.alerts('PickAWeek')
    }
    else {
      this.objGame = [];
      let validatorNumberEquals = 0;
      let i = 0;

     
      // let games = 1;
      debugger
      for (let index = 0; index < this.howManyGame; index++) {
        this.objGame[index] = {
          id: index+1,
          Week: moment(this.week).format('DD-MM-YYYY'),
          NumberOfGame: ''
        }
      }


      for (let index = 0; index < this.howManyGame; index++) {
        i = 0;
        let arrayAuxGame : any[] = []

        while (i < 15) {
          debugger
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
            }else {
              this.objGame[index].NumberOfGame = arrayAuxGame;
            }
        }else {
          this.objGame[index].NumberOfGame = arrayAuxGame;
        }

        this.objGame[index].NumberOfGame.forEach(e => {
          if (e < 9) {
            let toString = e.toString();
            e = '0' + toString;
          }else{
            e.toString();
          }
        });

      }


      
      
    }
    console.log(this.objGame);
    
    this.drawNumbers = !this.drawNumbers;
  }

  public selectOlderGame() {
    this.drawNumbers = !this.drawNumbers;
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

  public startDbSQlite() {
    this.dbService.initDB();
  }

  public async insertGame() {
    debugger
    
      let ConfirmSaveGame = await this.alertCtrl.create({
        mode: 'ios',
        header: 'Confirmar',
        message: 'Deseja realmente salvar este jogo?',
        buttons: [{
          text: 'Sim', handler: () => {
            this.gameProvider.insert(this.objGame)
            this.objGame = [];
            this.drawNumbers = false;
            this.gameProvider.dismiss();
            
          }
        },
        { text: 'Cancelar' }]
      });

      await ConfirmSaveGame.present();
    



  }


  public getAllMeusJogos() {
    debugger
    this.gameProvider.getAllOrderByDate().then(data => {
      this.myGames = data
      console.log('mygames',this.myGames); 
     
      this.contentIsLoad = true;
      this.gameProvider.dismiss();

    })
  }

  public getNumersOfGameByDateChosen(){
    console.log(this.dateChosen);
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
      let aux: any = data
      for (let index = 0; index < aux.length; index++) {
        this.objGame[index] = {
          id: index+1,
          Week: aux[index].Week,
          NumberOfGame: aux[index].NumberOfGame
        }
      }
      
      
     
      this.gameProvider.dismiss();
      console.log('getNumbersOfGameByDateChosen',this.objGame);
      
    })
    
  }

  public inputmMyGame() {
    this.isInputMyGame = !this.isInputMyGame
  }

  public segmentChanged(ev: any) {
    console.log(ev);
    
    let e = ev.target.value;
    if(e === 'randomNumbers'){
      this.segment = 'randomNumbers'
    } else {
      this.segment = 'resultGame'
    }
    
  }

  public salveGame() {
    debugger
    let split = this.myGame;
    console.log(split.split('.'));

  }

  public clear(){
    this.objGame = []
    this.week = ''
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

  teste(){
    // console.log(this.resultWeek);
    // console.log(this.objGame);
    // let resultSplit: any = this.resultWeek.split('-')
    // let teste: any[] = []
  
    // // 01-02-03-05      -- resultSplit
    // //05-09-12-16-18-19 -- gamne
    // for (let i = 0; i < this.objGame.length; i++) {
    //   debugger
    //   let gameSplit : any = this.objGame[i].NumberOfGame.split(',');
    //   gameSplit.forEach(game => {
    //     resultSplit.forEach(result => {
    //       if (game == result) {
    //         teste.push(game)
    //       }
    //     });
    //   });
      
    // }
    
    /*
    TODO:
      * Alterar type table sqlite para INT
      * Trabalhar so com INTEIROS
      * fazer no html 25 botões com valores inteiros para o user ir clicando nas bolinhas do resultado
      * fazer component - modal  e usar também no input de um jogo ja realizada 
      * terminar essa logica no metodo teste q contabiliza quantos acertos o jogo tem no resultado
    
    */
    
    console.log(this.resultWeek);
    
    
    
  }



}