import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { Observable } from 'rxjs';

import { LoadingService } from '../service/loading.service';
import { ModalPage } from '../modal/modal.page';
import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { SqlStorageService } from '../service/sql-storage.service';
import { SELECT_VLIVE } from '../vo/query';

@Component({
  selector: 'app-vlive',
  templateUrl: './vlive.page.html',
  styleUrls: ['./vlive.page.scss'],
})
export class VlivePage implements OnInit {
  vliveUrl: Observable<string>;
  starName = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController,
    private menuToolbarService: MenuToolBarService,
    private sqlStorageService: SqlStorageService,
    private ga: GoogleAnalytics
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#3cb7bd');

      menuToolbarService.changeClass(MENUS.VLIVE);
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.ngOnInit();
  }

  ngOnInit() {
    this.ga.trackView('VlivePage');

    this.loadingService.presentLoading();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.setVlive_SL();
  }

  setVlive_SL() {
    this.sqlStorageService.query(SELECT_VLIVE, [this.starName]).then(data => {
      if(data.res.rows.length > 0) this.vliveIframeInit(data.res.rows.item(0).vliveUrl);
    });
  }

  vliveIframeInit(vliveUrl: string) {
    console.log('vliveUrl', vliveUrl);
    if(document.querySelector('#vlive-content iframe')) document.querySelector('#vlive-content iframe').remove();

    // create and insert vlive iframe tag
    let iframe = document.createElement('iframe');
    iframe.scrolling = 'yes';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.src = vliveUrl;

    document.getElementById('vlive-content').appendChild(iframe);

    this.loadingService.dismissLoading();
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
