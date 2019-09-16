import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { LoadingController, IonContent } from '@ionic/angular';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';

export interface Twitter {
  userName: string;
  tweetName: string;
  timelineUrl: string;
  order: string;
}

@Component({
  selector: 'app-twitter',
  templateUrl: './twitter.page.html',
  styleUrls: ['./twitter.page.scss'],
})
export class TwitterPage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  isLoading = false;
  twitterList: Observable<Twitter[]>
  activatedTweet: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseDB: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
    this.loadingService.presentLoading();

    let starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.twitterList = this.firebaseDB.list<Twitter>('sns/twitter/' + starName, ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            ...c.payload.val()
          }))
        })
      );

    this.twitterList.subscribe(twitterList => {
      this.twitterWidgetInit(twitterList[0].timelineUrl, twitterList[0].tweetName);
    });
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
    if(document.querySelector('[id^="twitter-widget"]')) {
      document.querySelector('[id^="twitter-widget"]').remove();
    }
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

}
