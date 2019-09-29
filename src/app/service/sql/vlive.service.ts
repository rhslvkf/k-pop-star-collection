import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

import { SqlStorageService } from '../sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_VLIVE, INSERT_UPDATE_DATE_BY_TABLE_NAME } from 'src/app/vo/query';
import { StarService } from './star.service';

@Injectable({
  providedIn: 'root'
})
export class VliveService {

  constructor(
    private sqlStorageService: SqlStorageService,
    private firebaseDB: AngularFireDatabase,
    private starService: StarService
  ) { }

  async syncVliveTable() {
    let updateDateSL = await this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['vlive']);
    let updateDateFB = await this.getUpdateDateVlive_FB();

    if(updateDateSL.res.rows.length == 0 || updateDateFB > updateDateSL.res.rows.item(0).updateDate) {
      return this.syncVlive_FB_SL(updateDateFB);
    }

    return Promise.resolve();
  }

  getUpdateDateVlive_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('vlive/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  async syncVlive_FB_SL(updateDateFB: string) {
    await this.insertVlive_SL();
    await this.insertUpdateDateVlive_SL(updateDateFB);
    return Promise.resolve();
  }

  getVlive_FB(starName: string) {
    return this.firebaseDB.object<string>('vlive/list/' + starName).snapshotChanges().pipe(map(res => {
      return res.payload.val()
    }));
  }

  async insertVlive_SL() {
    let starNames = await this.starService.selectStarNames();
    let vliveCount = 0;
    let doneCount = 0;

    return new Promise(resolve => {
      for(let starName of starNames) {
        this.getVlive_FB(starName).subscribe(async (vliveUrl) => {
          if(vliveUrl != null) vliveCount++;
          await this.sqlStorageService.query(INSERT_VLIVE, [vliveUrl, starName]);
          if(vliveUrl != null && vliveCount == ++doneCount) resolve();
        });
      }
    });
  }

  insertUpdateDateVlive_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['vlive', updateDate]);
  }
}
