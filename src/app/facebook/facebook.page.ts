import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StatusBar } from '@ionic-native/status-bar/ngx';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { ModalController } from '@ionic/angular';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_FACEBOOK } from '../vo/query';

export interface Facebook {
  userName: string;
  timelineUrl: string;
  order?: string;
}

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.page.html',
  styleUrls: ['./facebook.page.scss'],
})
export class FacebookPage implements OnInit {
  facebookList: Facebook[] = [];
  activatedFacebook: string;
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
      statusBar.backgroundColorByHexString('#304a80');

      menuToolbarService.changeClass(MENUS.FACEBOOK);
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.facebookList = [];
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.setFacebook_SL();
  }

  setFacebook_SL() {
    this.sqlStorageService.query(SELECT_FACEBOOK, [this.starName]).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        let facebook = data.res.rows.item(i);
        this.facebookList.push({userName: facebook.userName, timelineUrl: facebook.timelineUrl});

        if(i == 0) this.facebookWidgetInit(facebook.timelineUrl, facebook.userName);
      }
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
