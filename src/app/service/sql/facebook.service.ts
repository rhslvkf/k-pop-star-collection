import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

import { SqlStorageService } from '../sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_UPDATE_DATE_BY_TABLE_NAME, INSERT_FACEBOOK } from 'src/app/vo/query';
import { Facebook } from 'src/app/facebook/facebook.page';
import { StarService } from './star.service';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(
    private sqlStorageService: SqlStorageService,
    private firebaseDB: AngularFireDatabase,
    private starService: StarService
  ) { }

  async syncFacebookTable() {
    let updateDateSL = await this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['facebook']);
    let updateDateFB = await this.getUpdateDateFacebook_FB();

    if(updateDateSL.res.rows.length == 0 || updateDateFB > updateDateSL.res.rows.item(0).updateDate) {
      return this.syncFacebook_FB_SL(updateDateFB);
    }

    return Promise.resolve();
  }

  getUpdateDateFacebook_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('sns/facebook/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  async syncFacebook_FB_SL(updateDateFB: string) {
    await this.insertFacebook_SL();
    await this.insertUpdateDateFacebook_SL(updateDateFB);
    return Promise.resolve();
  }

  getFacebook_FB(starName: string) {
    return this.firebaseDB.list<Facebook>('sns/facebook/list/' + starName).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ ...c.payload.val() }))
    }));
  }

  async insertFacebook_SL() {
    let starNames = await this.starService.selectStarNames();
    let facebookCount = 0;
    let doneCount = 0;

    return new Promise(resolve => {
      for(let starName of starNames) {
        this.getFacebook_FB(starName).subscribe(async (facebooks) => {
          if(facebooks.length > 0) facebookCount++;
          for(let facebook of facebooks) {
            await this.sqlStorageService.query(INSERT_FACEBOOK, [facebook.timelineUrl, starName, facebook.order, facebook.userName]);
          }
          if(facebooks.length > 0 && facebookCount == ++doneCount) resolve();
        });
      }
    });
  }

  insertUpdateDateFacebook_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['facebook', updateDate]);
  }
}
