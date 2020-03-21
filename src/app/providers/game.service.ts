import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private dbProvider: DatabaseService) { }


  public insert(obj) {
  
    for (let index = 0; index < obj.length; index++) {
      let data = [obj[index].Week, JSON.stringify(obj[index].NumberOfGame)]
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
