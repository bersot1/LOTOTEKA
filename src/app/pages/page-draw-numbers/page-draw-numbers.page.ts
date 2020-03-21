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
  public isRandomNumbers: boolean = true;

  public howManyGame: number = 1;
  public week: any;
  public myGame: any;
  public numersRandom: any[] = [];
  public loading: any;
  public objGame: any[] = [];

  public selectedImage: string;
  public imageText: string;
  public myGames: any;
  public dateChosen: any;



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
    this.contentLoad()

  }

  public contentLoad() {
    this.startDbSQlite();
    this.getAllMeusJogos();
    
  }

  public generateNumbers() {
    debugger
    if (this.week === undefined || this.week === null) {
      this.alerts('PickAWeek')
    }
    else {
      // this.objGame.numbers = [];
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
          validatorNumberEquals = 0;
          let min = Math.ceil(1);
          let max = Math.floor(25);
          let result = Math.floor(Math.random() * (max - min)) + min;
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
            this.objGame.forEach(e => {
              e.Week = this.week
            });
            this.gameProvider.insert(this.objGame)
            this.objGame = [];
            this.drawNumbers = false;
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

    })
  }

  public getNumersOfGameByDateChosen(){
    console.log(this.dateChosen);
    this.gameProvider.getAllGamesByDate(this.dateChosen).then(data => {
     
      this.objGame.push(data);
     
      console.log('getNumbersOfGameByDateChosen',this.objGame);
      
    })
    
  }

  public async selectSource() {
    let actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Use Library',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Capture Image',
          handler: () => {
            this.getPicture(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public getPicture(sourceType: PictureSourceType) {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: sourceType,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true
    }).then((imageData) => {
      this.selectedImage = `data:image/jpeg;base64,${imageData}`;
    });
  }

  public recognizeImage() {
    this.loadingRecognizeImage();
    Tesseract.recognize(this.selectedImage)
      .then(message => {
        console.log('message recognize', message.data.text);
        this.imageText = message.data.text
        this.loadingCtrl.dismiss();

      }).catch(err => {
        console.log(err);
      }).then(result => {
        console.log('result', result);
      })
  }

  public async loadingRecognizeImage() {
    var load = await this.loadingCtrl.create({
      message: 'Reconhecendo imagem... Aguarde!',
      duration: 1000000
    });
    await load.present();
  }


  public inputmMyGame() {
    this.isInputMyGame = !this.isInputMyGame
  }

  public segmentChanged(ev: any) {
    let e = ev.target.value;
    e === 'randomNumbers' ? this.isRandomNumbers = true : this.isRandomNumbers = false;
  }

  public salveGame() {
    debugger
    let split = this.myGame;
    console.log(split.split('.'));

  }

  public maskGame(input) {


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

}