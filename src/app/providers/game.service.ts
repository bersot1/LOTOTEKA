import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private dbProvider: DatabaseService) { }


    public insert(week: any, numbers: any) {
        debugger
        let data = [week, JSON.stringify(numbers)]
        return this.dbProvider.initDB()
            .then((db: SQLiteObject) => {
                let sql = 'insert into Games (Week,NumberOfGame) VALUES (?,?)'
                return db.executeSql(sql, data).then(() => {
                  console.log('inserido com sucesso');
                  
                })
                .catch((e) => { console.log('error ao inserir', e);
                 })
            }).catch((e) => {
                console.log('Error no initdb', e);
                
            })
    }

    public getAll() {
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
                return games;
        }
            })
            .catch((e) => console.error(e));
        })
        .catch((e) => console.error(e));
    }
}
