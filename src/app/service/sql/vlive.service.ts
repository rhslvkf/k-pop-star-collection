import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_VLIVE } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class VliveService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncVliveTable(): Promise<any> {
    return await this.sqlStorageService.query(INSERT_VLIVE);
  }

}
