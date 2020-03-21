import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public isLoading = false;

  constructor(private dbProvider: DatabaseService,
    public loadingCtrl: LoadingController
  ) { }

  public async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      mode: 'ios',
      spinner: 'circles',
      message: 'Carregando',
      translucent: true,
      cssClass: 'cssLoading'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  public async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss();
  }
  public insert(obj) {
    this.present();

    for (let index = 0; index < obj.length; index++) {

      let convertToString = JSON.stringify(obj[index].NumberOfGame);
      let stringReplace1 = convertToString.replace('[', "")
      let stringReplace2 = stringReplace1.replace(']',"")
      let data = [obj[index].Week, stringReplace2];

      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Games (Week,NumberOfGame) VALUES (?,?)'
          return db.executeSql(sql, data).then(() => {
            console.log('inserido com sucesso');

          })
            .catch((e) => {
              console.log('error ao inserir', e);
            })
        }).catch((e) => {
          console.log('Error no initdb', e);

        })
    }
    
    return result
    
  }

  public getAllOrderByDate() {
    this.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT Week FROM Games GROUP BY Week ', [])
          .then((data) => {
            debugger
            console.log('then select all');

            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              console.log('item for', item);

              games.push(item);

            }
            
            return games;
            
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


  public getAll() {
    this.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games', [])
          .then((data) => {
            debugger
            console.log('then select all');

            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              console.log('item for', item);

              games.push(item);

            }
            return games;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
  public getAllGamesByDate(date) {
    this.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games G WHERE G.Week = ?', [date])
          .then((data) => {
            debugger
            console.log('then select all games by date');

            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              console.log('item for by date', item);

              games.push(item);

            }
            return games;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
}
