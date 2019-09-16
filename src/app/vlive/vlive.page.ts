import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-vlive',
  templateUrl: './vlive.page.html',
  styleUrls: ['./vlive.page.scss'],
})
export class VlivePage implements OnInit {
  vliveUrl: Observable<string>

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.presentLoading();

    let starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.vliveUrl = this.firebaseDB.object<string>('vlive/' + starName)
      .snapshotChanges()
      .pipe(map(res => res.payload.val()));

    this.vliveUrl.subscribe(res => {
      // create and insert vlive iframe tag
      let iframe = document.createElement('iframe');
      iframe.scrolling = 'yes';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = res;

      document.getElementById('vlive-content').appendChild(iframe);

      this.loadingService.dismissLoading();
    });
  }

}
