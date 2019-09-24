import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MyToastService {
  constructor(private toastController: ToastController) { }

  showToast(toastMessage) {
    this.toastController.create({
      message: toastMessage,
      duration: 2000
    }).then((toastData) => {
      toastData.present();
    });
  }
}
