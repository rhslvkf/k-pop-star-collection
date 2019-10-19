import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_TWITTER } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncTwitterTable(): Promise<any> {
    return await this.sqlStorageService.query(INSERT_TWITTER);
  }

}
