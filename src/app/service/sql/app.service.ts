import { Injectable } from '@angular/core';

import { SqlStorageService } from '../sql-storage.service';
import { App } from 'src/app/vo/app';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private sqlStorageService: SqlStorageService
  ) { }

  async syncAppTable() {
    let app = await this.selectAppTable();
    if(app.executeCount == 0) {
      await this.insertAppTable(app.executeCount, app.rateFlag);
    }
    return this.updateAppTable(app.executeCount + 1, app.rateFlag)
  }

  async selectAppTable(): Promise<App> {
    let data = await this.sqlStorageService.query('SELECT * FROM app');
    let dataLength = data.res.rows.length;

    if(dataLength == 0) {
      return Promise.resolve(new App());
    }

    let app = new App();
    app.executeCount = data.res.rows.item(0).executeCount;
    app.rateFlag = data.res.rows.item(0).rateFlag;

    return Promise.resolve(app);
  }

  insertAppTable(executeCount: number, rateFlag: number) {
    return this.sqlStorageService.query(`INSERT INTO app(executeCount, rateFlag) VALUES(${executeCount}, ${rateFlag})`);
  }

  updateAppTable(executeCount: number, rateFlag: number) {
    return this.sqlStorageService.query(`UPDATE app SET executeCount = ${executeCount}, rateFlag = ${rateFlag}`);
  }
}
