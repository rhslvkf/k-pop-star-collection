import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  isLoading = false;

  constructor(private loadingCtrl: LoadingController) { }

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
}
