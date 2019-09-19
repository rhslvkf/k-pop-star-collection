import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';

import { LoadingService } from '../loading.service';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';

export interface Facebook {
  userName: string;
  timelineUrl: string;
  order: string;
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.page.html',
  styleUrls: ['./facebook.page.scss'],
})
export class FacebookPage implements OnInit {
  facebookList: Observable<Facebook[]>
  activatedFacebook: string;
  starName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#304a80');

      let menuToolbar = document.getElementById('menu-toolbar') as HTMLElement;
      menuToolbar.classList.remove('home', 'youtube', 'twitter', 'facebook', 'vlive');
      menuToolbar.classList.add('facebook');
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.facebookList = this.firebaseDB.list<Facebook>('sns/facebook/' + this.starName, ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          return changes.map(c => ({
            ...c.payload.val()
          }))
        })
      );

    this.facebookList.subscribe(facebookList => {
      this.facebookWidgetInit(facebookList[0].timelineUrl, facebookList[0].userName);
    });
  }

  facebookWidgetInit(timelineUrl: string, userName: string) {
    this.loadingService.presentLoading();

    this.activatedFacebook = userName;

    this.removeFacebookWidget();

    // create facebook a tag
    let a = document.createElement('a');
    a.href = timelineUrl;
    a.appendChild(document.createTextNode(userName));

    // create facebook blockquote tag
    let blockquote = document.createElement('blockquote');
    blockquote.cite = timelineUrl;
    blockquote.className = 'fb-xfbml-parse-ignore';
    blockquote.appendChild(a);

    // create and insert facebook div tag
    let div = document.createElement('div');
    div.className = 'fb-page';
    div.setAttribute('data-href', timelineUrl);
    div.setAttribute('data-tabs', 'timeline,events,messages');
    div.setAttribute('data-small-header', 'true');
    div.setAttribute('data-adapt-container-width', 'true');
    div.setAttribute('data-hide-cover', 'false');
    div.setAttribute('data-show-facepile', 'false');
    div.appendChild(blockquote);
    let fbRoot = document.getElementById('fb-root');
    fbRoot.parentNode.insertBefore(div, fbRoot);

    // create and insert facebook sdk javascript
    let js = document.createElement('script');
    js.id = 'facebook-sdk-js';
    js.async = true;
    js.defer = true;
    js.crossOrigin = 'anonymous';
    js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v4.0';
    let fjs = document.getElementsByTagName('script')[0];
    fjs.parentNode.insertBefore(js, fjs);

    this.loadingService.dismissLoading();
  }

  removeFacebookWidget() {
    if(document.querySelector('.fb-page')) {
      document.querySelector('.fb-page').remove();
    }
    if(document.querySelector('#facebook-sdk-js')) {
      document.querySelector('#facebook-sdk-js').remove();
    }
    if(window['FB']) {
      delete window['FB'];
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
