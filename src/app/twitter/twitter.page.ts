import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_TWITTER } from '../vo/query';
import { EmailService } from '../service/email.service';

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
  noTwitter = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService,
    private emailService: EmailService,
    private ga: GoogleAnalytics
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
    this.ga.trackView('TwitterPage');

    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.setTwitter_SL();
  }

  setTwitter_SL() {
    this.sqlStorageService.query(SELECT_TWITTER, [this.starName]).then(data => {
      let dataLength = data.res.rows.length;
      if(dataLength == 0) {
        this.noTwitter = true;
        this.loadingService.dismissLoading();
      }
      for(let i = 0; i < dataLength; i++) {
        let twitter = data.res.rows.item(i);
        this.twitterList.push({userName: twitter.userName, tweetName: twitter.tweetName, timelineUrl: twitter.timelineUrl});

        if(i == 0) this.twitterWidgetInit(twitter.timelineUrl, twitter.tweetName, twitter.userName);
      }
    });
  }

  twitterWidgetInit(timelineUrl: string, tweetName: string, userName: string) {
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
      if(document.querySelector('.twitter-timeline-error')) {
        clearInterval(interval);
        this.loadingService.dismissLoading();

        let subject = 'Request modification';
        let body = `Can't connect to <b>${userName}</b> Twitter`;
        let div = document.createElement('div');
        div.innerHTML = body;
        let button = document.createElement('ion-button');
        button.innerHTML = '<ion-icon name="send"></ion-icon>' + subject;
        button.onclick = () => {
          this.emailService.sendEmail(subject, body);
        };
        document.querySelector('#twitter-error').appendChild(div);
        document.querySelector('#twitter-error').appendChild(button);
      }
    }, 300);
  }

  removeTwitterWidget() {
    if(document.querySelector('[id^="twitter-widget"]')) document.querySelector('[id^="twitter-widget"]').remove();

    if(document.querySelector('.twitter-timeline-error')) document.querySelector('.twitter-timeline-error').remove();
    let twitterError = document.querySelector('#twitter-error');
    while(twitterError.hasChildNodes()) {
      twitterError.removeChild(twitterError.firstChild);
    }
  }

  removeElementById(id: string) {
    if(document.getElementById(id)) {
      document.getElementById(id).remove();
    }
  }

  scrollToTop() {
    this.ionContent.scrollToTop(0);
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
