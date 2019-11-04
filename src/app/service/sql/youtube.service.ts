import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_HOT_YOUTUBE } from 'src/app/vo/hot_youtube_query';
import { INSERT_STREAMINGCHART_YOUTUBE } from 'src/app/vo/streamingchart_youtube_query';
import { INSERT_YOUTUBE } from 'src/app/vo/youtube_query';
import { INSERT_RECENTLY_POPULAR_YOUTUBE } from 'src/app/vo/recently_popular_youtube_query';

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
    await this.sqlStorageService.query(INSERT_RECENTLY_POPULAR_YOUTUBE);
    await this.sqlStorageService.query(INSERT_HOT_YOUTUBE);
    return await this.sqlStorageService.query(INSERT_STREAMINGCHART_YOUTUBE);
  }

}