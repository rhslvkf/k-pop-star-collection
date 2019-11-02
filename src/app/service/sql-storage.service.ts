import { Injectable } from '@angular/core';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { CREATE_TABLE_STARS, CREATE_TABLE_STAR_SITES, CREATE_TABLE_YOUTUBE, CREATE_TABLE_TWITTER, CREATE_TABLE_FACEBOOK, CREATE_TABLE_VLIVE, CREATE_TABLE_FAVORITE_YOUTUBE, CREATE_TABLE_APP, CREATE_TABLE_STREAMING_CHART, CREATE_TABLE_HOT_YOUTUBE } from '../vo/query';

@Injectable({
  providedIn: 'root'
})
export class SqlStorageService {
  storage: any;
  DB_NAME = 'k-pop-star-collection.db';

  constructor(
    private sqlite: SQLite
  ) { }

  async initSQL(): Promise<any> {
    // await this.sqlite.deleteDatabase({name: this.DB_NAME, location: 'default'});
    await this.sqlite.create({name: this.DB_NAME, location: 'default'}).then(async (db: SQLiteObject) => {
      this.storage = db;
      return await this.createTables();
    });
  }

  async createTables(): Promise<any> {
    await this.query(CREATE_TABLE_STARS);
    await this.query(CREATE_TABLE_STAR_SITES);
    await this.query(CREATE_TABLE_YOUTUBE);
    await this.query(CREATE_TABLE_HOT_YOUTUBE);
    await this.query(CREATE_TABLE_TWITTER);
    await this.query(CREATE_TABLE_FACEBOOK);
    await this.query(CREATE_TABLE_VLIVE);
    await this.query(CREATE_TABLE_FAVORITE_YOUTUBE);
    await this.query(CREATE_TABLE_APP);
    return this.query(CREATE_TABLE_STREAMING_CHART);
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
