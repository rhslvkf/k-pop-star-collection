import { Injectable } from '@angular/core';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

import { SqlStorageService } from '../sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_STARS, INSERT_STAR_SITES, INSERT_UPDATE_DATE_BY_TABLE_NAME, SELECT_STARS_NAME } from 'src/app/vo/query';
import { Star } from 'src/app/vo/star';

@Injectable({
  providedIn: 'root'
})
export class StarService {

  constructor(
    private sqlStorageService: SqlStorageService,
    private firebaseDB: AngularFireDatabase
  ) { }

  async syncStarTable(): Promise<any> {
    let updateDateSL = await this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['stars']);
    let updateDateFB = await this.getUpdateDateStars_FB();

    if(updateDateSL.res.rows.length == 0 || updateDateFB > updateDateSL.res.rows.item(0).updateDate) {
      return this.syncStars_FB_SL(updateDateFB);
    }

    return Promise.resolve();
  }

  getUpdateDateStars_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('stars/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  async syncStars_FB_SL(updateDateFB: string): Promise<any> {
    return new Promise(resolve => {
      this.getStars_FB().subscribe(async (stars) => {
        for(let star of stars) {
          await this.insertStars_SL(star);
          await this.insertStarSites_SL(star);
          await this.insertUpdateDateStars_SL(updateDateFB);
        }
        resolve();
      });
    });
  }

  getStars_FB() {
    return this.firebaseDB.list<Star>('stars/list').snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ name: c.payload.key, ...c.payload.val() }))
    }));
  }

  insertStars_SL(star: Star) {
    return this.sqlStorageService.query(INSERT_STARS, [star.name, star.order, star.updateDate, star.name]);
  }

  insertStarSites_SL(star: Star) {
    if(star.sites) {
      let blog = star.sites.blog ? star.sites.blog : null;
      let instagram = star.sites.instagram ? star.sites.instagram : null;
      let officialSite = star.sites.officialSite ? star.sites.officialSite : null;

      return this.sqlStorageService.query(INSERT_STAR_SITES, [star.name, blog, instagram, officialSite]);
    }

    return Promise.resolve();
  }

  insertUpdateDateStars_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['stars', updateDate]);
  }

  async selectStarNames(): Promise<string[]> {
    let starNames: string[] = [];
    let data = await this.sqlStorageService.query(SELECT_STARS_NAME);
    let dataLength = data.res.rows.length;

    for(let i = 0; i < dataLength; i++) {
      starNames.push(data.res.rows.item(i).name);
      if(i == (dataLength - 1)) {
        return Promise.resolve(starNames);
      }
    }
  }
}
