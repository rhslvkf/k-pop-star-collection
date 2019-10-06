import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { SqlStorageService } from 'src/app/service/sql-storage.service';
import { SELECT_FAVORITE_YOUTUBE, SELECT_FAVORITE_YOUTUBE_STAR_NAME, DELETE_FAVORITE_YOUTUBE } from 'src/app/vo/query';
import { Youtube } from 'src/app/vo/youtube';
import { MyToastService } from 'src/app/service/my-toast.service';
import { MenuToolBarService } from 'src/app/service/menu-toolbar.service';
import { MENUS } from 'src/app/vo/menus';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.page.html',
  styleUrls: ['./youtube.page.scss'],
})
export class YoutubePage {
  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  youtubeList: Youtube[] = [];
  starNameList: string[] = [];
  terms = "";
  noFavoriteContents = false;

  constructor(
    private youtube: YoutubeVideoPlayer,
    private sqlStorageService: SqlStorageService,
    private myToastService: MyToastService,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar,
    private menuToolbarService: MenuToolBarService
  ) {
    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#7d19ff');
      menuToolbarService.changeClass(MENUS.FAVORITE);

      this.setYoutube_SL();
    });
  }

  setYoutube_SL() {
    this.sqlStorageService.query(SELECT_FAVORITE_YOUTUBE_STAR_NAME).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        this.starNameList.push(data.res.rows.item(i).starName);
      }
    });

    this.sqlStorageService.query(SELECT_FAVORITE_YOUTUBE).then(data => {
      let dataLength = data.res.rows.length;

      if(dataLength == 0) this.noFavoriteContents = true;

      for(let i = 0; i < dataLength; i++) {
        let youtube = data.res.rows.item(i);
        this.youtubeList.push({videoId: youtube.videoId, title: youtube.title, thumbnailUrl: youtube.thumbnailUrl, time: youtube.time, starName: youtube.starName});
      }
    });
  }

  playYoutube(videoId: string) {
    this.youtube.openVideo(videoId);
  }

  scrollToTop() {
    this.ionContent.scrollToTop(0);
  }

  logScrolling() {
    let d = document.querySelector('#youtube-content #scrollTopBtn') as HTMLElement;
    if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop >= 200) {
      d.style.display = "block";
    } else if (document.querySelector('#youtube-content').shadowRoot.querySelector('.inner-scroll').scrollTop < 200) {
      d.style.display = "none";
    }
  }

  removeFavorite(videoId: string, event: Event) {
    event.stopPropagation();
    this.myToastService.showToast('Removed from your favorites');

    document.querySelector('[data-id="' + videoId + '"]').remove();

    for(let i = 0; i < this.youtubeList.length; i++) {
      if(this.youtubeList[i].videoId == videoId) {
        this.youtubeList.splice(i, 1);
      }
    }

    this.sqlStorageService.query(DELETE_FAVORITE_YOUTUBE, [videoId]);
  }

  youtubeSorting(name: string, index: number) {
    if(name == 'ALL') {
      document.querySelector('.button-contents .all').classList.add('selected');
      let d = document.querySelectorAll('.button-contents .starName');
      for (let i = 0; i < d.length; i++) {
        d[i].classList.remove('selected');
      }
    } else {
      document.querySelector('.button-contents .all').classList.remove('selected');
      document.querySelector('.button-contents .index' + index).classList.toggle('selected');

      if(!document.querySelector('.button-contents ion-button.selected')) {
        document.querySelector('.button-contents .all').classList.add('selected');
      }
    }

    this.terms = 'starName';

    let d = document.querySelectorAll('.button-contents ion-button.selected');
    for (let i = 0; i < d.length; i++) {
      if(d[i].innerHTML == 'ALL') {
        break;
      }
      this.terms += '|' + d[i].innerHTML;
    }
  }

}
