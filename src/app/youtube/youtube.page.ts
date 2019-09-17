import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';
import { MyToastService } from '../my-toast.service';

export interface Youtube {
  videoId?: string;
  title: string;
  thumbnailUrl: string;
  time: string;
  order: string;
}

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  youtubeList: Observable<Youtube[]>
  terms = "";
  allSort = true;
  mvSort = false;
  fanCamSort = false;
  stageMixSort = false;
  dancePracticeSort = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private youtube: YoutubeVideoPlayer,
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private myToastService: MyToastService,
    private statusBar: StatusBar
  ) { }
  
  ngOnInit() {
    this.statusBar.backgroundColorByHexString('#d40000');

    this.loadingService.presentLoading();

    let starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.youtubeList = this.firebaseDB.list<Youtube>(starName, ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          this.loadingService.dismissLoading();
          return changes.map(c => ({
            videoId: c.payload.key, ...c.payload.val()
          }))
        })
      );
  }

  playYoutube(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  scrollToTop() {
    this.ionContent.scrollToTop(500);
  }

  logScrolling() {
    let d = document.querySelector('#youtube-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  addFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Added to favorites.');
  }

  youtubeSorting(terms: string) {
    if(terms == 'ALL' && !this.allSort) {
      this.allSort = true;
      this.mvSort = this.fanCamSort = this.stageMixSort = this.dancePracticeSort = false;
    } else if(terms == 'MV') {
      this.mvSort = !this.mvSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'FanCam') {
      this.fanCamSort = !this.fanCamSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'StageMix') {
      this.stageMixSort = !this.stageMixSort;
      if(this.allSort) this.allSort = false;
    } else if(terms == 'DancePractice') {
      this.dancePracticeSort = !this.dancePracticeSort;
      if(this.allSort) this.allSort = false;
    }

    if(!(this.allSort || this.mvSort || this.fanCamSort || this.stageMixSort || this.dancePracticeSort)) {
      this.allSort = true;
    }

    this.terms = '';

    if(this.mvSort) this.terms += 'MV|M/V';
    if(this.fanCamSort) {
      if(this.terms != '') this.terms += '|';
      this.terms += 'fancam|fan cam|직캠';
    }
    if(this.stageMixSort) {
      if(this.terms != '') this.terms += '|';
      this.terms += 'stagemix|stage mix|교차편집|교차 편집';
    }
    if(this.dancePracticeSort) {
      if(this.terms != '') this.terms += '|';
      this.terms += 'dancepractice|dance practice|안무연습|안무 연습';
    }
  }

}
