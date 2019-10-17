import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { INSERT_STREAMING_CHART } from 'src/app/vo/query';

@Injectable({
  providedIn: 'root'
})
export class StreamingchartService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncStreamingChartTable(): Promise<any> {
    return await this.sqlStorageService.query(INSERT_STREAMING_CHART);
  }
}
