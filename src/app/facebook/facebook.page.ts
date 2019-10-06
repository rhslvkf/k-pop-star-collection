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
import { EmailService } from '../service/email.service';

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
  noFacebook = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService,
    private emailService: EmailService
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
      if(dataLength == 0) {
        this.noFacebook = true;
        this.loadingService.dismissLoading();
      }
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

    // wait for loading facebook widget and dismiss loading
    let interval = setInterval(() => {
      let d = document.querySelector('.fb-page > span') as HTMLElement;
      if(d && d.style.verticalAlign == 'bottom' && d.offsetHeight > 0) {
        clearInterval(interval);
        this.loadingService.dismissLoading();
      } else if(d && d.style.verticalAlign == 'bottom' && d.offsetHeight == 0) {
        clearInterval(interval);
        this.loadingService.dismissLoading();

        let subject = 'Request modification';
        let body = `Can't connect to <b>${userName}</b> Facebook`;
        let div = document.createElement('div');
        div.innerHTML = body;
        let button = document.createElement('ion-button');
        button.innerHTML = '<ion-icon name="send"></ion-icon>' + subject;
        button.onclick = () => {
          this.emailService.sendEmail(subject, body);
        };
        document.querySelector('#facebook-error').appendChild(div);
        document.querySelector('#facebook-error').appendChild(button);
      }
    }, 300);
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

    let facebookError = document.querySelector('#facebook-error');
    while(facebookError.hasChildNodes()) {
      facebookError.removeChild(facebookError.firstChild);
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
