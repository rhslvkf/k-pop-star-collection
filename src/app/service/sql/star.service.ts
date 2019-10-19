import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_STARS, INSERT_STAR_SITES } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class StarService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncStarTable(): Promise<any> {
    await this.sqlStorageService.query(INSERT_STARS);
    return this.sqlStorageService.query(INSERT_STAR_SITES);
  }

}
