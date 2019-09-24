import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoadingController, IonContent, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { map } from 'rxjs/operators';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_UPDATE_DATE_BY_TABLE_NAME, INSERT_TWITTER, INSERT_UPDATE_DATE_BY_TABLE_NAME, SELECT_TWITTER } from '../vo/query';

export interface Twitter {
  userName: string;
  tweetName: string;
  timelineUrl: string;
  order?: string;
}

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.page.html',
  styleUrls: ['./twitter.page.scss'],
})
export class TwitterPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  isLoading = false;
  twitterList: Twitter[] = [];
  activatedTweet: string;
  starName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseDB: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#1989cf');

      menuToolbarService.changeClass(MENUS.TWITTER);
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.twitterList = [];
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.loadData();
  }

  loadData() {
    this.sqlStorageService.query(SELECT_UPDATE_DATE_BY_TABLE_NAME, ['twitter.' + this.starName]).then(data => {
      this.getUpdateDateTwitter_FB().then(updateDateFB => {
        if (data.res.rows.length > 0 && updateDateFB <= data.res.rows.item(0).updateDate) {
          // firebase db와 일치한 경우
          this.setTwitter_SL();
        } else {
          // firebase db와 일치하지 않은 경우
          this.syncTwitter_FB_SL(updateDateFB)
          .then(() => this.setTwitter_SL())
        }
      });
    });
  }

  setTwitter_SL() {
    this.sqlStorageService.query(SELECT_TWITTER, [this.starName]).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let twitter = data.res.rows.item(i);
        this.twitterList.push({userName: twitter.userName, tweetName: twitter.tweetName, timelineUrl: twitter.timelineUrl});

        if(i == 0) this.twitterWidgetInit(twitter.timelineUrl, twitter.tweetName);
      }
    });
  }

  getUpdateDateTwitter_FB(): Promise<string> {
    let updateDateFB = this.firebaseDB.object<string>('sns/twitter/updateDate').snapshotChanges().pipe(map(res => res.payload.val()));
    
    return new Promise(resolve => {
      updateDateFB.subscribe(res => {
        resolve(res);
      })
    });
  }

  syncTwitter_FB_SL(updateDateFB: string) {
    let completeCount = 0;

    return new Promise(resolve => {
      this.getTwitter_FB().subscribe(twitters => {
        twitters.forEach(twitter => {
          this.insertTwitter_SL(twitter)
          .then(() => this.insertUpdateDateTwitter_SL(updateDateFB))
          .then(() => {if(twitters.length == ++completeCount) resolve()});
        });
      });
    });
  }

  getTwitter_FB() {
    return this.firebaseDB.list<Twitter>('sns/twitter/list/' + this.starName).snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ ...c.payload.val() }))
    }));
  }

  insertTwitter_SL(twitter: Twitter) {
    return this.sqlStorageService.query(INSERT_TWITTER, [twitter.timelineUrl, this.starName, twitter.order, twitter.tweetName, twitter.userName]);
  }

  insertUpdateDateTwitter_SL(updateDate: string) {
    return this.sqlStorageService.query(INSERT_UPDATE_DATE_BY_TABLE_NAME, ['twitter.' + this.starName, updateDate]);
  }

  twitterWidgetInit(timelineUrl: string, tweetName: string) {
    this.loadingService.presentLoading();

    this.activatedTweet = tweetName;

    document.getElementById('scrollTopBtn').style.display = "none";

    this.removeTwitterWidget();

    // create and insert twitter widget a tag
    let a = document.createElement('a');
    a.className = 'twitter-timeline';
    a.href = timelineUrl;
    a.style.display = 'none';
    a.appendChild(document.createTextNode(tweetName));
    document.getElementById('twitter-timeline').appendChild(a);
    
    // create and insert twitter widget javascript
    let js = document.createElement('script');
    js.id = 'twitter-wjs';
    js.src = 'https://platform.twitter.com/widgets.js';
    this.removeElementById(js.id);
    let fjs = document.getElementsByTagName('script')[0];
    fjs.parentNode.insertBefore(js, fjs);

    // wait for loading twitter widget and dismiss loading
    let interval = setInterval(() => {
      if(document.getElementById('twitter-timeline').offsetHeight > document.body.offsetHeight) {
        clearInterval(interval);
        this.loadingService.dismissLoading();
      }
    }, 300);
  }

  removeTwitterWidget() {
    if(document.querySelector('[id^="twitter-widget"]')) document.querySelector('[id^="twitter-widget"]').remove();
  }

  removeElementById(id: string) {
    if(document.getElementById(id)) {
      document.getElementById(id).remove();
    }
  }

  presentLoading() {
    if(this.isLoading) return;

    this.isLoading = true;

    this.loadingCtrl.create({
      message: 'Please wait...'
    }).then((res) => {
      res.present();
      if(!this.isLoading) {
        res.dismiss();
      }
    });
  }

  dismissLoading() {
    this.isLoading = false;
    this.loadingCtrl.dismiss().catch(e => {});
  }

  scrollToTop() {
    this.ionContent.scrollToTop(500);
  }

  logScrolling() {
    let d = document.querySelector('#tweet-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#tweet-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#tweet-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
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
