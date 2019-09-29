import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

import { SqlStorageService } from '../sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_TWITTER, INSERT_UPDATE_DATE_BY_TABLE_NAME } from 'src/app/vo/query';
import { Twitter } from 'src/app/twitter/twitter.page';
import { StarService } from './star.service';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(
    private sqlStorageService: SqlStorageService,
    private firebaseDB: AngularFireDatabase,
    private starService: StarService
  ) { }

  async syncTwitterTable(): Promise<any> {
    let updateDateSL = await this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['twitter']);
    let updateDateFB = await this.getUpdateDateTwitter_FB();

    if(updateDateSL.res.rows.length == 0 || updateDateFB > updateDateSL.res.rows.item(0).updateDate) {
      return this.syncTwitter_FB_SL(updateDateFB);
    }

    return Promise.resolve();
  }

  getUpdateDateTwitter_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('sns/twitter/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  async syncTwitter_FB_SL(updateDateFB: string) {
    await this.insertTwitter_SL();
    await this.insertUpdateDateTwitter_SL(updateDateFB);
    return Promise.resolve();
  }

  getTwitter_FB(starName: string) {
    return this.firebaseDB.list<Twitter>('sns/twitter/list/' + starName).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ ...c.payload.val() }))
    }));
  }

  async insertTwitter_SL() {
    let starNames = await this.starService.selectStarNames();
    let twitterCount = 0;
    let doneCount = 0;

    return new Promise(resolve => {
      for(let starName of starNames) {
        this.getTwitter_FB(starName).subscribe(async (twitters) => {
          if(twitters.length > 0) twitterCount++;
          for(let twitter of twitters) {
            await this.sqlStorageService.query(INSERT_TWITTER, [twitter.timelineUrl, starName, twitter.order, twitter.tweetName, twitter.userName]);
          }
          if(twitters.length > 0 && twitterCount == ++doneCount) resolve();
        });
      }
    });
  }

  insertUpdateDateTwitter_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['twitter', updateDate]);
  }
}
