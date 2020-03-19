import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, ActionSheetController, LoadingController } from '@ionic/angular';
import { DatabaseService } from 'src/app/providers/database.service';
import { GameService } from '../../providers/game.service'
import * as Tesseract from 'tesseract.js'
import { Camera, PictureSourceType } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx'


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

  public week: any;
  public myGame: any;
  public numersRandom: any[] = [];
  public loading: any;
  public objGame: any = {
    week: '',
    numbers: [],
  }

  public selectedImage: string;
  public imageText: string;



  constructor(
    public alertCtrl: AlertController,
    public dbService: DatabaseService,
    public gameProvider: GameService,
    public navCtrl: NavController,
    private camera: Camera,
    private actionSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController,
    private barcodeScanner: BarcodeScanner
  ) { }

  ngOnInit() {
    this.contentLoad()

  }

  public contentLoad() {
    this.startDbSQlite();
    this.contentIsLoad = true;
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

  public readBarCode() {
    this.barcodeScanner.scan().then((data: any) => {
      console.log('barcodeScanner', data);

    }).catch(er => {
      console.log('error barcode', er);

    })
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
    

    console.log(input.detail.value);

  }

}