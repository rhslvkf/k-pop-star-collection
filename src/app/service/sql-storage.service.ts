import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { CREATE_TABLE_STARS, CREATE_TABLE_UPDATE_STATUS, CREATE_TABLE_STAR_SITES, CREATE_TABLE_YOUTUBE, CREATE_TABLE_TWITTER, CREATE_TABLE_FACEBOOK, CREATE_TABLE_VLIVE } from '../vo/query';

@Injectable({
  providedIn: 'root'
})
export class SqlStorageService {
  storage: any;
  DB_NAME = 'k-pop-star-collection.db';

  constructor(
    private sqlite: SQLite
  ) { }

  initSQL(): Promise<any> {
    return new Promise((resolve) => {
      this.sqlite.deleteDatabase({name: this.DB_NAME, location: 'default'});
      this.sqlite.create({
        name: this.DB_NAME, location: 'default'
      }).then((db: SQLiteObject) => {
        this.storage = db;
        this.query(CREATE_TABLE_UPDATE_STATUS)
        .then(() => this.query(CREATE_TABLE_STARS))
        .then(() => this.query(CREATE_TABLE_STAR_SITES))
        .then(() => this.query(CREATE_TABLE_YOUTUBE))
        .then(() => this.query(CREATE_TABLE_TWITTER))
        .then(() => this.query(CREATE_TABLE_FACEBOOK))
        .then(() => this.query(CREATE_TABLE_VLIVE))
        .then(() => resolve());
      });
    });
  }

  query(query: string, params: any[] = []): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.storage.transaction((tx: any) => {
            tx.executeSql(query, params,
              (tx: any, res: any) => resolve({ tx: tx, res: res }),
              (tx: any, err: any) => reject({ tx: tx, err: err }));
          },
          (err: any) => reject({ err: err }));
      } catch (err) {
        reject({ err: err });
      }
    });
  }
}
