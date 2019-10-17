import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { StreamingchartPage } from './streamingchart.page';

const routes: Routes = [
  {
    path: '',
    component: StreamingchartPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StreamingchartPage],
  providers: [YoutubeVideoPlayer]
})
export class StreamingchartPageModule {}
