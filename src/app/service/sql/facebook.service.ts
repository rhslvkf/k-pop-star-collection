import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_FACEBOOK } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class FacebookService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncFacebookTable(): Promise<any> {
    return await this.sqlStorageService.query(INSERT_FACEBOOK);
  }

}
