import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { MenuToolBarService } from '../service/menu-toolbar.service';
import { MENUS } from '../vo/menus';
import { AdmobfreeService } from '../service/admobfree.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private statusBar: StatusBar,
    private activatedRoute: ActivatedRoute,
    private menuToolbarService: MenuToolBarService,
    private admobFreeService: AdmobfreeService,
    private ga: GoogleAnalytics
  ) {
    ga.trackView('HomePage');

    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#1a9c95');
      menuToolbarService.changeClass(MENUS.HOME);
    });
  }

  showInterstitialAd() {
    this.admobFreeService.showInterstitialAd();
  }

}