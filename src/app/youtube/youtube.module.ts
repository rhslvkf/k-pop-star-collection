import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { YoutubePage } from './youtube.page';
import { PipesModule } from '../pipe/pipes.module';
import { ModalPageModule } from '../modal/modal.module';

const routes: Routes = [
  {
    path: '',
    component: YoutubePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule,
    ModalPageModule
  ],
  declarations: [YoutubePage],
  providers: [YoutubeVideoPlayer]
})
export class YoutubePageModule {}
