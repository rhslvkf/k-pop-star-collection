import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_YOUTUBE, INSERT_UPDATE_DATE_BY_TABLE_NAME } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  starName: string;

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncYoutubeTable(): Promise<any> {
    let updateDateSL = await this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['youtube']);
    let updateDateApp = '20190929';

    if(updateDateSL.res.rows.length == 0 || updateDateApp > updateDateSL.res.rows.item(0).updateDate) {
      await this.sqlStorageService.query(INSERT_YOUTUBE);
      return await this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['youtube', updateDateApp]);
    }

    return Promise.resolve();
  }

}
