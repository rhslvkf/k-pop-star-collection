import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_YOUTUBE } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  starName: string;

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncYoutubeTable(): Promise<any> {
    return await this.sqlStorageService.query(INSERT_YOUTUBE);
  }

}