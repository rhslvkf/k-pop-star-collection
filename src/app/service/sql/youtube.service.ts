import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_YOUTUBE, INSERT_STREAMINGCHART_YOUTUBE, INSERT_HOT_YOUTUBE } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  starName: string;

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncYoutubeTable(): Promise<any> {
    await this.sqlStorageService.query(INSERT_YOUTUBE);
    await this.sqlStorageService.query(INSERT_HOT_YOUTUBE);
    return await this.sqlStorageService.query(INSERT_STREAMINGCHART_YOUTUBE);
  }

}