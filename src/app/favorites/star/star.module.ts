import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StarPage } from './star.page';
import { PipesModule } from 'src/app/pipe/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: StarPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule
  ],
  declarations: [StarPage]
})
export class StarPageModule {}
