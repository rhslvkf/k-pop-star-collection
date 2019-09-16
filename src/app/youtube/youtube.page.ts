import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoadingService } from '../loading.service';
import { MyToastService } from '../my-toast.service';

export interface Youtube {
  videoId?: string;
  title: string;
  thumbnailUrl: string;
  time: string;
  order: string;
}

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage implements OnInit {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  youtubeList: Observable<Youtube[]>

  constructor(
    private activatedRoute: ActivatedRoute,
    private youtube: YoutubeVideoPlayer,
    private firebaseDB: AngularFireDatabase,
    private loadingService: LoadingService,
    private myToastService: MyToastService
  ) { }
  
  ngOnInit() {
    this.loadingService.presentLoading();

    let starName = this.activatedRoute.snapshot.paramMap.get('starName');

    this.youtubeList = this.firebaseDB.list<Youtube>(starName, ref => ref.orderByChild('order'))
      .snapshotChanges()
      .pipe(
        map(changes => {
          this.loadingService.dismissLoading();
          return changes.map(c => ({
            videoId: c.payload.key, ...c.payload.val()
          }))
        })
      );
  }

  playYoutube(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  scrollToTop() {
    this.ionContent.scrollToTop(500);
  }

  logScrolling() {
    let d = document.querySelector('#youtube-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  addFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Added to favorites.');
  }

}
