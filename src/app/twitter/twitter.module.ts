import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TwitterPage } from './twitter.page';
import { ModalPageModule } from '../modal/modal.module';

const routes: Routes = [
  {
    path: '',
    component: TwitterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ModalPageModule
  ],
  declarations: [TwitterPage]
})
export class TwitterPageModule {}
