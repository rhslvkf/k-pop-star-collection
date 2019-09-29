import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_TWITTER } from '../vo/query';

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

    this.setTwitter_SL();
  }

  setTwitter_SL() {
    console.log('setTwitter_SL');
    this.sqlStorageService.query(SELECT_TWITTER, [this.starName]).then(data => {
      console.log('select_twitter', data);
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let twitter = data.res.rows.item(i);
        this.twitterList.push({userName: twitter.userName, tweetName: twitter.tweetName, timelineUrl: twitter.timelineUrl});

        if(i == 0) this.twitterWidgetInit(twitter.timelineUrl, twitter.tweetName);
      }
    });
  }

  twitterWidgetInit(timelineUrl: string, tweetName: string) {
    console.log(timelineUrl, tweetName);
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
