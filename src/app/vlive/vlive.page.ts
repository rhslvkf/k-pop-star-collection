import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';
import { ModalPage } from '../modal/modal.page';

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
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private statusBar: StatusBar,
    private modalCtrl: ModalController
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#3cb7bd');

      let menuToolbar = document.getElementById('menu-toolbar') as HTMLElement;
      menuToolbar.classList.remove('home', 'youtube', 'twitter', 'facebook', 'vlive');
      menuToolbar.classList.add('vlive');
    });
  }

  goSelf(starName: string) {
    this.starName = starName;
    this.ngOnInit();
  }

  ngOnInit() {
    this.loadingService.presentLoading();

    if(document.querySelector('#vlive-content iframe')) document.querySelector('#vlive-content iframe').remove();

    if(this.starName == '') this.starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.vliveUrl = this.firebaseDB.object<string>('vlive/' + this.starName)
      .snapshotChanges()
      .pipe(map(res => res.payload.val()));

    this.vliveUrl.subscribe(res => {
      // create and insert vlive iframe tag
      let iframe = document.createElement('iframe');
      iframe.scrolling = 'yes';
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.src = res;

      document.getElementById('vlive-content').appendChild(iframe);

      this.loadingService.dismissLoading();
    });
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
