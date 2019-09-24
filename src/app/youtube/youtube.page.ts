import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, ModalController } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

import { LoadingService } from '../service/loading.service';
import { MyToastService } from '../service/my-toast.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_YOUTUBE, INSERT_UPDATE_DATE_BY_TABLE_NAME, SELECT_YOUTUBE } from '../vo/query';
import { Observable } from 'rxjs';

export interface Youtube {
  videoId: string;
  starName?: string;
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
  youtubeList: Youtube[] = [];
  youtubeListObserver: Observable<Youtube[]>;
  starName = "";
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
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#d40000');
      menuToolbarService.changeClass(MENUS.YOUTUBE);
    });
  }
  
  goSelf(starName: string) {
    this.starName = starName;
    this.youtubeList = [];
    this.youtubeListObserver = null;
    this.ngOnInit();
  }

  ngOnInit() {
    // this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.loadData();

    // this.youtubeList = this.firebaseDB.list<Youtube>('youtube/' + this.starName, ref => ref.orderByChild('order'))
    // .snapshotChanges()
    // .pipe(
    //   map(changes => {
    //     this.loadingService.dismissLoading();
    //     return changes.map(c => ({
    //       videoId: c.payload.key, ...c.payload.val()
    //     }))
    //   })
    // );
  }

  loadData() {
    this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['youtube.' + this.starName]).then(data => {
      this.getUpdateDateYoutube_FB().then(updateDateFB => {
        if (data.res.rows.length > 0 && updateDateFB <= data.res.rows.item(0).updateDate) {
          // firebase db와 일치한 경우
          this.setYoutube_SL();
        } else {
          // firebase db와 일치하지 않은 경우
          this.syncYoutube_FB_SL(updateDateFB)
          .then(() => this.setYoutube_SL())
        }
      });
    });
  }

  setYoutube_SL() {
    this.sqlStorageService.query(SELECT_YOUTUBE, [this.starName]).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let youtube = data.res.rows.item(i);
        this.youtubeList.push({videoId: youtube.videoId, title: youtube.title, thumbnailUrl: youtube.thumbnailUrl, time: youtube.time, order: youtube.order});
      }
    });
  }

  getUpdateDateYoutube_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('youtube/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  syncYoutube_FB_SL(updateDateFB: string) {
    let completeCount = 0;

    return new Promise(resolve => {
      this.getYoutube_FB().subscribe(youtubes => {
        youtubes.forEach(youtube => {
          this.insertYoutube_SL(youtube)
          .then(() => this.insertUpdateDateYoutube_SL(updateDateFB))
          .then(() => {if(youtubes.length == ++completeCount) resolve()});
        });
      });
    });
  }

  getYoutube_FB() {
    this.youtubeListObserver = this.firebaseDB.list<Youtube>('youtube/list/' + this.starName, ref => ref.orderByChild('order')).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ videoId: c.payload.key, ...c.payload.val() }))
    }));

    return this.youtubeListObserver;
  }

  insertYoutube_SL(youtube: Youtube) {
    return this.sqlStorageService.query(INSERT_YOUTUBE, [youtube.videoId, this.starName, youtube.order, youtube.thumbnailUrl, youtube.time, youtube.title]);
  }

  insertUpdateDateYoutube_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['youtube.' + this.starName, updateDate]);
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

  async openModal() {
    const modal = await this.modalCtrl.create({
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: 'search-star-modal',
      component: ModalPage,
      componentProps: {
        'callParentFunction': this.goSelf.bind(this)
      }
    });

    return await modal.present();
  }

}
