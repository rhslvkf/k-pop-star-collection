import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule, NavParams } from '@ionic/angular';

import { ModalPage } from './modal.page';
import { PipesModule } from '../pipe/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule,
    PipesModule
  ],
  declarations: [ModalPage],
  entryComponents: [ModalPage],
  exports: [ModalPage]
})
export class ModalPageModule {}
