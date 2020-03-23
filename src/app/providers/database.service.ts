import { Injectable } from '@angular/core'
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx'
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})

export class DatabaseService {

    private database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        private sqlite: SQLite,
        private plt: Platform
    ) {
       
    }

    public initDB(){
        return this.sqlite.create({
            name: 'Games.db',
            location: 'default'
        })
           
    }

    public createDataBase(){
        return this.initDB()
            .then((db: SQLiteObject) => {
                this.createTables(db);
            })
    }

    public createTables(db: SQLiteObject){
        db.sqlBatch(
            [
            'CREATE TABLE IF NOT EXISTS Concursos (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Concurso INTEGER, AwardedNumbers TEXT)',
            'CREATE TABLE IF NOT EXISTS Games (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, Register Text, MyNumbers TEXT)',
            'CREATE TABLE IF NOT EXISTS Results (Id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, IdGame INTEGER, IdConcurso INTEGER, MyRightNumbers TEXT)'
        ]
        ).then(() => {
            console.log('tabelas criadas');
            
        }).catch((e) => {
            console.log('error ao criar tabelas', e);
            
        })
    }
}