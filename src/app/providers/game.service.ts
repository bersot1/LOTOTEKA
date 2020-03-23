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

  constructor(private dbProvider: DatabaseService,
    public loadingProvider: loadingProvider
  ) { }

  
  public insertGame(obj) {
    this.loadingProvider.present();
    debugger

    for (let index = 0; index < obj.length; index++) {

      // let convertToString = JSON.stringify(obj[index].NumberOfGame);
      // let stringReplace1 = convertToString.replace('[', "")
      // let stringReplace2 = stringReplace1.replace(']',"")
      let data = [obj[index].Register, obj[index].MyNumbers];

      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Games (Register,MyNumbers) VALUES (?,?)'
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

  public insertConcurso(obj) {
    this.loadingProvider.present();
    let data = [obj.Concurso, obj.AwardedNumbers]
      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Concursos (Concurso,AwardedNumbers) VALUES (?,?)'
          return db.executeSql(sql, data).then(() => {
            console.log('inserido com sucesso');

          })
            .catch((e) => {
              console.log('error ao inserir', e);
            })
        }).catch((e) => {
          console.log('Error no initdb', e);

        })

    
    return result
    
  }


  public insertResult(obj) {
    this.loadingProvider.present();
    for (let index = 0; index < obj.length; index++) {
      debugger
      // let convertToStringResultOfWeek = JSON.stringify(obj[index].ResultOfWeek);
      // let stringReplaceROW = convertToStringResultOfWeek.replace('[', "")
      // let stringReplaceROW2 = stringReplaceROW.replace(']',"")

      let data = [obj[index].IdGame, obj[index].IdConcurso, obj[index].RightNumbers ];

      var result = this.dbProvider.initDB()
        .then((db: SQLiteObject) => {
          let sql = 'insert into Results (IdGame,IdConcurso, RightNumbers) VALUES (?,?,?)'
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
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT Register FROM Games GROUP BY Register ', [])
          .then((data) => {
           
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
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games', [])
          .then((data) => {
        
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
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Games G WHERE G.Register = ?', [date])
          .then((data) => {
  
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

  public getAllConcursos() {
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Concursos', [])
          .then((data) => {
            console.log('then select all Concursos');

            let concursos: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              console.log('item for concurso', item);

              concursos.push(item);

            }
            return concursos;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }

  public getConcursoByNumber(number) {
    debugger
    let stringNumber = number.toString();
    let data = [stringNumber]
    this.loadingProvider.present();
    return this.dbProvider.initDB()
      .then((db: SQLiteObject) => {
        return db.executeSql('SELECT * FROM Concursos WHERE Concurso = ?', [data])
          .then((data) => {
  
            console.log('then select all games by date');

            let concurso: any[] = [];
            for (let i = 0; i < data.rows.length; i++) {

              let item = data.rows.item(i);
              console.log('item for by date', item);

              concurso.push(item);

            }
            return concurso;
          })
          .catch((e) => console.error(e));
      })
      .catch((e) => console.error(e));
  }


 

}
