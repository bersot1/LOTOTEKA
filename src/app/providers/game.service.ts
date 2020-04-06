import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { LoadingController } from '@ionic/angular';
import { loadingProvider } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  public isLoading = false;

  constructor(
    private dbProvider: DatabaseService,
    private loadingProvider: loadingProvider
  ) { }


  public insertGame(obj) {
    this.loadingProvider.present();


    for (let index = 0; index < obj.length; index++) {

      // let convertToString = JSON.stringify(obj[index].NumberOfGame);
      // let stringReplace1 = convertToString.replace('[', "")
      // let stringReplace2 = stringReplace1.replace(']',"")
      let data = [obj[index].Register, obj[index].MyNumbers];

      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Games (Register,MyNumbers) VALUES (?,?)'
          return db.executeSql(sql, data).then(() => {

          })
            .catch((e) => {

            })
        }).catch((e) => {


        });
    }

    return result;

  }

  public insertConcurso(obj) {
    this.loadingProvider.present();
    let data = [obj.Concurso, obj.AwardedNumbers];
    let result = this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        let sql = 'insert into Concursos (Concurso,AwardedNumbers) VALUES (?,?)';
        return db.executeSql(sql, data).then(() => {


        })
          .catch((e) => {

          })
      }).catch((e) => {


      })


    return result;

  }


  public insertResult(obj) {
    this.loadingProvider.present();
    for (let index = 0; index < obj.length; index++) {
      let data = [obj[index].IdGame, obj[index].IdConcurso, obj[index].RightNumbers];

      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Results (IdGame,IdConcurso, MyRightNumbers) VALUES (?,?,?)'
          return db.executeSql(sql, data).then(() => {



          })
            .catch((e) => {

            })
        }).catch((e) => {


        })
    }

    return result

  }



  public getAllOrderByDate() {
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT Register FROM Games GROUP BY Register ', [])
          .then((data) => {


            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);


              games.push(item);

            }

            return games;

          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


  public getAll() {
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games', [])
          .then((data) => {

            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              ;

              games.push(item);

            }
            return games;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }
  public getAllGamesByDate(date) {
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games G WHERE G.Register = ?', [date])
          .then((data) => {



            let games: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);

              games.push(item);

            }
            return games;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getAllConcursos() {
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Concursos', [])
          .then((data) => {


            let concursos: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);

              concursos.push(item);

            }
            return concursos;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getConcursoByNumber(number) {
    let stringNumber = number.toString();
    let data = [stringNumber];
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Concursos WHERE Concurso = ?', [data])
          .then((data) => {

            let concurso: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);


              concurso.push(item);

            }
            return concurso;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }




}
