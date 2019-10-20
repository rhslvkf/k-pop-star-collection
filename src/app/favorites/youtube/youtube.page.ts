import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IonContent, IonInfiniteScroll } from '@ionic/angular';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GoogleAnalytics } from '@ionic-native/google-analytics/ngx';

import { SqlStorageService } from 'src/app/service/sql-storage.service';
import { SELECT_FAVORITE_YOUTUBE, SELECT_FAVORITE_YOUTUBE_STAR_NAME, DELETE_FAVORITE_YOUTUBE, SELECT_FAVORITE_YOUTUBE_COUNT } from 'src/app/vo/query';
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
  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  youtubeList: Youtube[] = [];
  starNameList: string[] = [];
  terms = "";
  youtubeCount = 0;
  offset = 0;
  limit = 20;
  noFavoriteContents = false;

  selectQuery: string;
  countQuery: string;

  constructor(
    private youtube: YoutubeVideoPlayer,
    private sqlStorageService: SqlStorageService,
    private myToastService: MyToastService,
    private activatedRoute: ActivatedRoute,
    private statusBar: StatusBar,
    private menuToolbarService: MenuToolBarService,
    private ga: GoogleAnalytics
  ) {
    this.ga.trackView('FavoriteYoutubePage');

    activatedRoute.params.subscribe(() => {
      statusBar.backgroundColorByHexString('#7d19ff');
      menuToolbarService.changeClass(MENUS.FAVORITE);

      this.setYoutube_SL();
    });
  }

  async setYoutube_SL() {
    this.selectQuery = SELECT_FAVORITE_YOUTUBE;
    this.countQuery = SELECT_FAVORITE_YOUTUBE_COUNT;

    this.sqlStorageService.query(SELECT_FAVORITE_YOUTUBE_STAR_NAME).then(data => {
      let dataLength = data.res.rows.length;
      for(let i = 0; i < dataLength; i++) {
        this.starNameList.push(data.res.rows.item(i).starName);
      }
    });

    await this.setYoutubeCount();
    if(this.youtubeCount == 0) this.noFavoriteContents = true;
    this.pushYoutube();
  }

  async setYoutubeCount() {
    let data = await this.sqlStorageService.query(this.countQuery);
    this.youtubeCount = data.res.rows.item(0).youtubeCount;
  }

  pushYoutube() {
    this.sqlStorageService.query(this.selectQuery, [this.offset, this.limit]).then(data => {
      let dataLength = data.res.rows.length;

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

  youtubeSorting(name: string, index?: number) {
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

    this.infiniteScroll.disabled = false;
    this.youtubeList = [];
    this.offset = 0;
    this.terms = '';

    let d = document.querySelectorAll('.button-contents ion-button.selected');
    for (let i = 0; i < d.length; i++) {
      if(d[i].innerHTML == 'ALL') {
        break;
      }
      if(i > 0) this.terms += ", ";
      this.terms += "'" + d[i].innerHTML + "'";
    }

    if(this.terms == '') { // ALL
      this.selectQuery = SELECT_FAVORITE_YOUTUBE;
      this.countQuery = SELECT_FAVORITE_YOUTUBE_COUNT;
    } else {
      this.selectQuery = `SELECT youtube.* FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId WHERE youtube.starName IN (${this.terms}) GROUP BY youtube.videoId ORDER BY youtube.views DESC LIMIT ?, ?`;
      this.countQuery = `SELECT COUNT(DISTINCT(youtube.videoId)) AS youtubeCount FROM youtube INNER JOIN favorite_youtube ON youtube.videoId = favorite_youtube.videoId WHERE youtube.starName IN (${this.terms})`;
    }

    this.setYoutubeCount();
    this.pushYoutube();
  }

  loadData(event) {
    setTimeout(() => {
      this.offset += this.limit;
      this.pushYoutube();
      if(this.offset + this.limit >= this.youtubeCount) {
        event.target.disabled = true;
      }
      event.target.complete();
    }, 500);
  }

}
